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

const buildDag = (stages, predecessor) => {
  const edges = [];

  Object.keys(stages)
    .filter((name) => !keysWeCareAbout.includes(name))
    .forEach((name) => {
      const stage = stages[name];
      if (!stage.after && !stage.env && !stage.vol) {
        edges.push([predecessor, name]);
      }

      stage.env = stage.env || [];
      stage.vol = stage.vol || [];
      stage.after = stage.after || [];

      keysThatCountForDeps.forEach((depKey) => {
        addDependencies(stage[depKey], name).forEach((edge) => edges.push(edge));
      });
    });

  return { stages, edges };
};

module.exports = buildDag;
