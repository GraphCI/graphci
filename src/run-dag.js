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
      return next();
    }

    const runStream = require('stream').PassThrough();
    runStream.pipe(fs.createWriteStream(`${runId}/${name}`));
    runStream.pipe(process.stdout);

    const env = (stage.env).map((stageName) => readFile(`${runId}/${stageName}`, 'utf8')
        .then((value) => `${stageName.toUpperCase()}=${value.trim()}`));

    return Promise.all(env)
      .then((Env) => docker.pull(stage.img)
          .then(() => {
            const cmd = ['/bin/sh', '-c', `${stage.run}`];
            const config = {
              Env,
              Binds: [
                `${process.cwd()}:/src`,
                `${process.cwd()}/${runId}:/out`,
                `${process.env.HOME}/.aws:/root/.aws`,
              ],
            };

            return docker.run(stage.img, cmd, runStream, config);
          })
          .then(() => next())
          .catch(next));
  };

  return mkdir(`./${runId}`)
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
