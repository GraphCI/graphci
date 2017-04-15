const array = (x = []) => (Array.isArray(x) ? x : [x]);

const hasDependencies = (stages, stage) => array(stages[stage].after).length;

const getDependencies = (stages, stage) => array(stages[stage].after);

const hasNoRealEdges = (edges, stage) => edges.every(([x, y]) => x !== stage && y !== stage);

const build = (stages, [target, ...targets], edges = []) => {
  if (hasDependencies(stages, target)) {
    getDependencies(stages, target).forEach((dependency) => {
      edges.push([dependency, target]);
      targets.push(dependency);
    });
  }

  if (hasNoRealEdges(edges, target)) {
    edges.push([target, 'target']);
  }

  if (targets.length) {
    return build(stages, targets, edges);
  }

  return edges;
};

module.exports = build;
