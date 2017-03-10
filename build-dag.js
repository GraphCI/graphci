const isArray = require('lodash/isArray');

const keysWeCareAbout = [
  'after', 'img', 'run', 'out', 'vol', 'env', 'done'
]

const buildDag = (stages, predecessor) => {
  const edges = [];

  Object.keys(stages)
    .filter((name) => !keysWeCareAbout.includes(name))
    .forEach((name) => {
      if (!stages[name].after) {
        edges.push([predecessor, name])
        return;
      }

      if (isArray(stages[name].after)) {
        stages[name].after.forEach((descendent) => edges.push([descendent, name]))
        return;
      }

      edges.push([stages[name].after, name])
    })

  console.log(edges)

  return {stages, edges};
}

module.exports = buildDag;
