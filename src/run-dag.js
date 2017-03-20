const fs = require('fs');
const dag = require('breeze-dag');
const moment = require('moment');
const denodeify = require('denodeify');
const stream = require('stream');
const startDocker = require('./docker');
const uploadResults = require('./s3').uploadResults;
const uploadRun = require('./s3').uploadRun;
const uploadLogs = require('./s3').uploadLogs;
const uniq = require('lodash/uniq');

const mkdir = denodeify(fs.mkdir);
const readFile = denodeify(fs.readFile);

const concurrency = 10;
const SUCCESS = 0;
const FAILURE = 1;

const docker = startDocker();

const nothingToDo = (stage) => !stage || !stage.img;
const isStagePluckGlobalEnvVar = (name) => process.env[name];
const formatEnvVar = (KEY, val) => `${KEY}=${val}`;

const runDag = ({ stages, edges }) => {
  const runId = moment().valueOf();

  const getRunPath = () => `./${runId}`;
  const getRunVolsPath = () => `./${runId}/.vol`;
  const getAbsoluteRunVolsPath = () => `${process.cwd()}/${runId}/.vol`;
  const getStageOutputPath = (name) => `${runId}/${name}`;
  const getOutputOfStage = (name) => readFile(getStageOutputPath(name), 'utf8');
  const buildVolumeMapping = (name) => `${getAbsoluteRunVolsPath()}/${name}:/${name}`;

  uploadRun(runId, stages, edges).catch((error) => console.error(error));

  const forkOutputStream = (name, noLog) => {
    const runStream = stream.PassThrough();
    runStream.pipe(fs.createWriteStream(getStageOutputPath(name)));

    if (noLog) {
      return runStream;
    }

    runStream.pipe(process.stdout);
    return runStream;
  };

  const generateVolumeBindingsForStage = (stage) => {
    const volumes = [].concat(stage.vol).concat(stage.outVol);
    const upstream = volumes.filter((volumeName) => stages[volumeName]);
    const constantMappings = volumes.filter((volumeName) => !stages[volumeName]);

    const allBindings = [
      `${process.cwd()}/${runId}:/out`,
      `${process.env.HOME}/.aws:/root/.aws`,
    ]
    .concat(constantMappings)
    .concat(upstream.map(buildVolumeMapping));

    return uniq(allBindings);
  };

  const getEnvironmentVariablesForStage = (stage) => {
    const upstreamDep = stage.env.filter((priorStageName) => stages[priorStageName]);
    const constantDep = stage.env.filter((priorStageName) => !stages[priorStageName]);

    const upstreamValues = upstreamDep
        .map((priorStageName) => getOutputOfStage(priorStageName)
        .then((output) => output.trim())
        .then((output) => formatEnvVar(priorStageName.toUpperCase(), output)));

    const constantValues = constantDep
      .map((priorStageName) => priorStageName.toUpperCase())
      .map((PRIOR_STAGE_NAME) => formatEnvVar(PRIOR_STAGE_NAME, process.env[PRIOR_STAGE_NAME]));

    return upstreamValues.concat(constantValues);
  };

  const onStage = (name, next) => {
    console.info(`Running: ${name}`);

    const started = moment().utc().format();
    const NAME = name.toUpperCase();
    const stage = stages[name];

    const results = () => ({
      runId,
      name,
      started,
      finished: moment().utc().format(),
      success: true,
    });

    if (nothingToDo(stage)) {
      if (isStagePluckGlobalEnvVar(NAME)) {
        console.info(formatEnvVar(NAME, process.env[NAME]));
      } else {
        console.info(`Stage ${name} has nothing to do.`);
      }

      return uploadResults(runId, name, results())
        .then(() => next());
    }

    return docker.pull(stage.img)
      .then(() => Promise.all(getEnvironmentVariablesForStage(stage)))
      .then((Env) => {
        const cmd = ['/bin/sh', '-c', `${stage.run}`];
        const Binds = generateVolumeBindingsForStage(stage);

        return docker.run(stage.img, cmd, forkOutputStream(name, stage.noLog), {
          Binds,
          Env,
        });
      })
      .then(() => uploadResults(runId, name, results()))
      .then(() => {
        if (stage.noLog) {
          return undefined;
        }

        return uploadLogs(runId, name, getStageOutputPath(name));
      })
      .then(() => next())
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  };

  return mkdir(getRunPath())
    .then(() => mkdir(getRunVolsPath()))
    .then(() => new Promise((resolve, reject) => {
      const done = (err) => (err ? reject : resolve)(err || undefined);

      dag(edges, concurrency, onStage, done);
    }))
    .then(() => [runId, SUCCESS])
    .catch((err) => {
      console.error(err);

      return [runId, FAILURE];
    });
};

module.exports = runDag;
