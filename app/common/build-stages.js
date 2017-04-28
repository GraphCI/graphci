const array = (x = []) => (Array.isArray(x) ? x : [x]);

const buildStage = (key, { env, on, vol, after, outVol, targets, triggers, img, run }) => ({
  [key]: {
    name: key,
    NAME: key.toUpperCase(),
    result: 'unknown',
    img,
    run,
    on: array(on),
    env: array(env),
    vol: array(vol),
    after: array(after),
    targets: array(targets),
    outVol: array(outVol),
    triggers: array(triggers),
  },
});

const buildStages = ({ input, push }) => ({
  stages: Object.keys(input).reduce(
    (stages, key) => Object.assign(stages, buildStage(key, input[key])),
    {}
  ),
  push,
});

module.exports = buildStages;
