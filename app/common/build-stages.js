const array = (x = []) => (Array.isArray(x) ? x : [x]);

const buildStage = ({ name, env, vol, after, outVol, targets }) => ({
  name,
  NAME: name.toUpperCase(),
  result: 'unknown',
  on: array(env),
  env: array(env),
  vol: array(vol),
  after: array(after),
  targets: array(targets),
  outVol: array(outVol),
});

const buildStages = ({ input, push }) => ({
  stages: input.map(buildStage),
  push,
});

module.exports = buildStages;
