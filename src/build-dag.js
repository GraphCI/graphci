const prune = require('./utils/prune');

const isArray = require('lodash/isArray');

const keysWeCareAbout = ['after', 'img', 'run', 'vol', 'env', 'done'];
const keysThatCountForDeps = ['after', 'vol', 'env'];

const addDependencies = (dependencies, name) => {
  if (!dependencies) {
    return [];
  }

  if (isArray(dependencies)) {
    return dependencies.map((descendent) => [descendent, name]);
  }
  return [[dependencies, name]];
};

const buildDag = (stages, predecessor, target) => {
  const edges = [];

  Object.keys(stages)
    .filter((name) => !keysWeCareAbout.includes(name))
    .forEach((name) => {
      const stage = stages[name];
      if (!stage.after && !stage.env && !stage.vol) {
        edges.push([predecessor, name]);
      }

      stage.name = name;
      stage.NAME = stage.name.toUpperCase();
      stage.env = (isArray(stage.env) ? stage.env : [stage.env]).filter((x) => x);
      stage.vol = (isArray(stage.vol) ? stage.vol : [stage.vol]).filter((x) => x);
      stage.after = (isArray(stage.after) ? stage.after : [stage.after]).filter((x) => x);
      stage.outVol = (isArray(stage.outVol) ? stage.outVol : [stage.outVol]).filter((x) => x);

      keysThatCountForDeps.forEach((depName) => {
        addDependencies(stage[depName], name).forEach((edge) => edges.push(edge));
      });

      stage.vol.forEach((depName) => {
        stages[depName].outVol.push(depName);
      });
    });

  return { stages, edges: prune(target, [], edges) };
};

module.exports = buildDag;
