const prune = require('./utils/prune');

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

      stage.vol.filter(upstreamBindings).forEach((depName) => {
        stages[depName].outVol.push(depName);
      });
      stage.vol.filter(dockerStyleMappings).forEach((mapping) => {
        const depName = mapping.split(':')[0];
        if (stages[depName]) {
          stages[depName].outVol.push(depName);
        }
      });
    });

  return { stages, edges: prune(target, [], edges) };
};

module.exports = buildDag;
