const dag = require('breeze-dag');
const startDocker = require('./docker');

const concurrency = 10;
const docker = startDocker();

const runDag = ({stages, edges}) => {
  const onStage = (name, next) => {
    const stage = stages[name];

    console.log(name, stage);

    if (!stage) {
      return next();
    }

    const img = stage.img
    if (!img) {
      return next();
    }

    const cmd = ['/bin/sh', '-c', `${stage.run}`];

    console.log('trying to run', stage.img)

    docker.pull(stage.img)
      .then(() => {
        return docker
          .run(
            stage.img,
            ['/bin/sh', '-c', 'ls -l $SOMETHING'],
            process.stdout,
            {
              Env: ['SOMETHING=/derp'],
              Binds: ['/Users/distributedlife/projects/dockercise/node_modules:/derp']
            }
          );
      })
      .then(() => next())
      .catch(next);
  }

  return new Promise((resolve, reject) => {
    const done = (err) => {
      const result = err ? reject : resolve;
      result(err || undefined)
    }

    dag(edges, concurrency, onStage, done);
  })
}

module.exports = runDag;
