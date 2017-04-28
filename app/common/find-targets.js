const union = require('lodash/union');

const node = ({ triggers = [] }) => ({ triggers });

const getTargetsFromTriggers = (stages, push) => {
  const changes = union(...push.commits.map(({ added, removed, modified }) =>
    union(added, removed, modified)));

  const targets = changes.reduce((acc, change) =>
    union(acc, Object.keys(stages).filter((key) =>
      node(stages[key] || {}).triggers.includes(change))),
    []
  );

  return targets;
};

const findTargets = ({ stages, push }, targets) => ({
  targets: targets || getTargetsFromTriggers(stages, push),
  stages,
});

module.exports = findTargets;
