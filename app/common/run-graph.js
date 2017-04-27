const parseYaml = require('./parse-yaml');
const buildStages = require('./build-stages');
const findTargets = require('./find-targets');
const buildDag = require('./build-dag');
const runDag = require('./run-dag');

const debug = process.argv[3];
const cliTargets = process.argv[2] && process.argv[2].split(',');

const runGraph = (path, push) =>
  Promise.resolve({ path, push })
    .then(parseYaml)
    .then(buildStages)
    .then((x) => findTargets(x, cliTargets))
    .then(buildDag)
    .then(({ stages, edges, targets }) => runDag({ stages, edges }, debug, targets));

module.exports = runGraph;
