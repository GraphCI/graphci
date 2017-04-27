const union = require('lodash/union');

const node = ({ triggers = [] }) => ({ triggers });

const findTargets = ({ input, push }) => {
  const changes = union(...push.commits.map(({ added, removed, modified }) =>
    union(added, removed, modified)));

  const targets = changes.reduce((acc, change) =>
    union(acc, Object.keys(input).filter((key) =>
      node(input[key] || {}).triggers.includes(change))),
    []
  );

  return {
    input,
    targets,
  };
};

module.exports = findTargets;
