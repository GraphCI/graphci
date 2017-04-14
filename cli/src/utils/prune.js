const prune = (target, necessaryEdges, otherEdges) => {
  if (target) {
    const necessaryYs = necessaryEdges.map(([x]) => x);
    const isUseful = ([, y]) => target === y || necessaryYs.includes(y);
    const isUseless = (edge) => !isUseful(edge);

    if (otherEdges.length) {
      const uselessEdges = otherEdges.filter(isUseless);
      const usefulEdges = otherEdges.filter(isUseful);

      if (usefulEdges.length) {
        return prune(target, necessaryEdges.concat(usefulEdges), uselessEdges);
      }

      return necessaryEdges;
    }

    return necessaryEdges;
  }

  return otherEdges;
};

module.exports = prune;
