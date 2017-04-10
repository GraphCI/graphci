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
const colors = require('colors/safe');

const mkdir = denodeify(fs.mkdir);
const readFile = denodeify(fs.readFile);
const copydir = denodeify(require('copy-dir'));

const concurrency = 10;
const SUCCESS = 0;
const FAILURE = 1;

const docker = startDocker();

const nothingToDo = (stage) => !stage || !stage.img;
const isStagePluckGlobalEnvVar = (name) => process.env[name];
const formatEnvVar = (KEY, val) => `${KEY}=${val}`;

const runDag = ({ stages, edges }, debug) => {
  console.info('Running the graph');

  const runId = moment().valueOf();

  const getRunPath = () => `./${runId}`;
  const getRunVolsPath = () => `./${runId}/.vol`;
  const getAbsoluteRunVolsPath = () => `${process.cwd()}/${runId}/.vol`;
  const getStageOutputPath = (name) => `${runId}/${name}`;
  const getOutputOfStage = (name) => readFile(getStageOutputPath(name), 'utf8');

  const buildVolumeMapping = (volumeName, stageName) => {
    const outputOfPriorStage = `${getAbsoluteRunVolsPath()}/${volumeName}`;
    const ro = volumeName !== stageName ? ':ro' : '';

    return Promise.resolve(`${outputOfPriorStage}:/${volumeName}${ro}`);
  };

  const buildOperatesOnMapping = (volumeName, stageName) => {
    const outputOfPriorStage = `${getAbsoluteRunVolsPath()}/${volumeName}`;
    const defaultStageOutput = `${getAbsoluteRunVolsPath()}/${stageName}`;

    return copydir(outputOfPriorStage, defaultStageOutput)
      .then(() => `${defaultStageOutput}:/${stageName}`)
      .catch((err) => console.error(colors.red(err)));
  };

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

  const isCode = (volumeName) => volumeName === 'code';
  const isNotCode = (volumeName) => volumeName !== 'code';

  const generateVolumeBindingsForStage = (stage) => {
    const volumes = [].concat(stage.vol).concat(stage.outVol);
    const upstream = volumes.filter((volumeName) => stages[volumeName]).filter(isNotCode);
    const code = volumes.filter(isCode);
    const operatesOn = [stage.on].filter((x) => x);

    const upstreamPromises = upstream.map((vol) => buildVolumeMapping(vol, stage.name));
    const operatesOnPromises = operatesOn.map((vol) => buildOperatesOnMapping(vol, stage.name));
    const codePromises = code.map(() => Promise.resolve(`${process.cwd()}:/code:ro`));

    return Promise.all(upstreamPromises.concat(operatesOnPromises).concat(codePromises))
      .then((upstreamBindings) => [
        `${process.cwd()}/${runId}:/out`,
        `${process.env.HOME}/.aws:/root/.aws:ro`,
      ]
        .concat(upstreamBindings))
      .then(uniq);
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

    return upstreamValues
      .concat(constantValues)
      .concat(formatEnvVar('GRAPH_CI_RUN_ID', runId))
      .concat(formatEnvVar('OUT', `/${stage.name}`));
  };

  const onStage = (name, next) => {
    console.info(`Running: ${name}`);

    if (name === 'code') {
      // Code is never run, it is only mounted.
      next();
    }

    const started = moment().utc().format();
    const NAME = name.toUpperCase();
    const stage = stages[name];

    const results = (success = true) => ({
      runId,
      name,
      started,
      finished: moment().utc().format(),
      success,
    });

    const doDockerRun = (Env) => {
      const cmd = ['/bin/sh', '-c', `${stage.run}`];
      const BindsPromise = generateVolumeBindingsForStage(stage);
      const WorkingDir = stage.on ? `/${stage.name}` : stage.dir;

      return BindsPromise.then((Binds) => {
        if (debug) {
          console.info('stage', stage);
          console.info('Binds', Binds);
          console.info('Env', Env);
          console.info('cmd', cmd);
          console.info('WorkingDir', WorkingDir);
        }

        return docker.run(stage.img, cmd, forkOutputStream(name, stage.noLog), {
          Binds,
          Env,
          WorkingDir,
        });
      });
    };

    const findOutResultOfDockerRun = (response) => {
      const container = docker.getContainer(response.id);

      return new Promise((resolve, reject) => {
        container.inspect((err, data) => {
          if (data.State.ExitCode === FAILURE && !stage.neverFail) {
            reject(data.State.ExitCode);
          }

          resolve(data.State.ExitCode);
        });
      });
    };

    const logStageSummary = () => {
      console.warn(colors.red(`Stage "${name}" failed.`));
      console.warn(colors.red(`Run failed: ${runId}.`));
    };

    const exit = () => process.exit(1);

    const uploadLogsForStage = () => {
      if (stage.noLog || stage.logsUploaded) {
        return undefined;
      }

      return uploadLogs(runId, name, getStageOutputPath(name))
        .then(() => {
          stage.logsUploaded = true;
        });
    };

    const uploadSuccessResults = () => uploadResults(runId, name, results());
    const uploadFailureResults = () => uploadResults(runId, name, results(false));

    if (nothingToDo(stage)) {
      if (isStagePluckGlobalEnvVar(NAME)) {
        console.info(formatEnvVar(NAME, process.env[NAME]));
      } else {
        console.warn(colors.yellow(`Stage "${name}" has nothing to do. Is this intentional?`));
      }

      return uploadResults(runId, name, results())
        .then(() => next());
    }

    return docker.pull(stage.img)
      .then(() => Promise.all(getEnvironmentVariablesForStage(stage)))
      .then(doDockerRun)
      .then(findOutResultOfDockerRun)
      .then(uploadSuccessResults)
      .then(uploadLogsForStage)
      .then(() => next())
      .catch((error) => {
        console.error(colors.red('Stage with docker failed: ', error));

        return uploadFailureResults()
          .then(uploadLogsForStage)
          .then(logStageSummary)
          .then(exit);
      });
  };

  return mkdir(getRunPath())
    .then(() => mkdir(getRunVolsPath()))
    .then(() => new Promise((resolve, reject) => {
      const done = (err) => (err ? reject : resolve)(err || undefined);

      dag(edges, concurrency, onStage, done);
    }))
    .then(() => [runId, SUCCESS])
    .catch(() => [runId, FAILURE]);
};

module.exports = runDag;
