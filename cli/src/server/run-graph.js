const parseYaml = require('./parse-yaml');
const findTargets = require('./find-targets');
const buildDag = require('./build-dag');

const runGraph = (path, push) =>
  Promise.resolve({ path, push })
    .then(parseYaml)
    .then(findTargets)
    .then(buildDag);

module.exports = runGraph;
