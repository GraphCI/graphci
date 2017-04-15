const dependencyTypes = ['after', 'img', 'run', 'vol', 'env', 'done'];

const array = (x = []) => (Array.isArray(x) ? x : [x]);

const getDependencies = (targetStage) =>
  dependencyTypes.reduce((dependencies, dependencyType) =>
    dependencies.concat(array(targetStage[dependencyType])), []);

const hasNoRealEdges = (edges, stage) => edges.every(([x, y]) => x !== stage && y !== stage);

const build = (stages, [target, ...targets], edges = []) => {
  const targetStage = stages[target];
  const dependencies = getDependencies(targetStage);
  if (dependencies.length) {
    dependencies.forEach((dependency) => {
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
