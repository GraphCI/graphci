const prune = require('./utils/prune');
const colors = require('colors/safe');
const isArray = require('lodash/isArray');

const keysWeCareAbout = ['after', 'img', 'run', 'vol', 'env', 'done'];

const addDependencies = (dependencies, name) => {
  if (!dependencies) {
    return [];
  }

  if (isArray(dependencies)) {
    return dependencies.map((descendent) => [descendent, name]);
  }
  return [[dependencies, name]];
};

const defined = (x) => x;
const upstreamBindings = (volume) => !volume.includes(':');
const dockerStyleMappings = (volume) => volume.includes(':');

const buildDag = (stages, target) => {
  console.info('Building the graph');

  const edges = [];

  const addEdge = (edge) => edges.push(edge);

  Object.keys(stages)
    .filter((name) => !keysWeCareAbout.includes(name))
    .forEach((name) => {
      const stage = stages[name];
      if (!stage.after && !stage.env && !stage.vol) {
        edges.push(['dockercise', name]);
      }

      stage.name = name;
      stage.NAME = stage.name.toUpperCase();
      stage.env = (isArray(stage.env) ? stage.env : [stage.env]).filter(defined);
      stage.vol = (isArray(stage.vol) ? stage.vol : [stage.vol]).filter(defined);
      stage.after = (isArray(stage.after) ? stage.after : [stage.after]).filter(defined);
      stage.outVol = (isArray(stage.outVol) ? stage.outVol : [stage.outVol]).filter(defined);

      addDependencies(stage.after, name).forEach(addEdge);
      addDependencies(stage.env, name).forEach(addEdge);
      addDependencies(stage.vol.filter(upstreamBindings), name).forEach(addEdge);
      addDependencies([stage.on].filter(defined), name).forEach(addEdge);

      const warnAboutMissingDep = (missing, consumer) => {
        console.error(colors.red(`Cannot find "${missing}" to build volume dependency with "${consumer}"`));
      };

      if (stage.on && stage.on !== 'code') {
        if (!stages[stage.on]) {
          warnAboutMissingDep(stage.on, name);
        } else {
          stages[stage.on].outVol.push(name);
        }
      }
    });

  return { stages, edges: prune(target, [], edges) };
};

module.exports = buildDag;
