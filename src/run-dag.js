const fs = require('fs');
const dag = require('breeze-dag');
const moment = require('moment');
const denodeify = require('denodeify');
const startDocker = require('./docker');

const mkdir = denodeify(fs.mkdir);
const readFile = denodeify(fs.readFile);

const concurrency = 10;
const docker = startDocker();

const runDag = ({ stages, edges }) => {
  const runId = moment().valueOf();

  const onStage = (name, next) => {
    console.log(`Running: ${name}`);

    const stage = stages[name];

    if (!stage || !stage.img) {
      if (process.env[name.toUpperCase()]) {
        console.log(`${name.toUpperCase()}=${process.env[name.toUpperCase()]}`);
      }

      return next();
    }

    const runStream = require('stream').PassThrough();
    runStream.pipe(fs.createWriteStream(`${runId}/${name}`));
    runStream.pipe(process.stdout);

    const Binds = [
      `${process.cwd()}/${runId}:/out`,
      `${process.env.HOME}/.aws:/root/.aws`,
    ];

    [].concat(stage.vol).concat(stage.outVol).forEach((volName) => {
      if (stages[volName]) {
        Binds.push(`${process.cwd()}/${runId}/.vol/${volName}:/${volName}`);
      } else {
        Binds.push(volName);
      }
    });

    const env = (stage.env)
        .map((stageName) => {
          if (!stages[stageName]) {
            return `${stageName.toUpperCase()}=${process.env[stageName.toUpperCase()]}`;
          }

          return readFile(`${runId}/${stageName}`, 'utf8')
            .then((value) => `${stageName.toUpperCase()}=${value.trim()}`);
        });

    return Promise.all(env)
      .then((Env) => docker.pull(stage.img)
          .then(() => {
            const cmd = ['/bin/sh', '-c', `${stage.run}`];

            return docker.run(stage.img, cmd, runStream, { Env, Binds });
          })
          .then(() => next())
          .catch((err) => {
            console.error(err);
            process.exit(1);
          }));
  };

  return mkdir(`./${runId}`)
    .then(() => mkdir(`./${runId}/.vols`))
    .then(() => new Promise((resolve, reject) => {
      const done = (err) => {
        const result = err ? reject : resolve;
        result(err || undefined);
      };

      dag(edges, concurrency, onStage, done);
    }))
    .then(() => console.log(`Run completed: ${runId}`));
};

module.exports = runDag;
