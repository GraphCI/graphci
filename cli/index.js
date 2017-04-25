#! /usr/bin/env node

const yaml = require('js-yaml');
const denodeify = require('denodeify');
const readFile = denodeify(require('fs').readFile);
const glob = denodeify(require('glob'));
const colors = require('colors/safe');
const buildDag = require('./src/build-dag');
const runDag = require('./src/run-dag');
const { base, collapseMeta } = require('./src/meta');
const fetchSubgraphs = require('./src/subgraphs');

const target = process.argv[2];
const debug = process.argv[3];

glob('**/*.graphci.yaml', { ignore: ['**/node_modules/**'] })
  .then((files) => Promise.all(files.map((filename) => readFile(filename, 'utf8'))))
  .then((files) => files.map(yaml.safeLoad))
  .then(collapseMeta)
  .then(fetchSubgraphs)
  .then((files) => files.reduce((all, file) => Object.assign(base, all, file)), {})
  .then((stages) => buildDag(stages, target))
  .then((dag) => runDag(dag, debug, [target]))
  .then(([runId, result]) => {
    console.log(colors.green(`Run successful: ${runId}`));
    process.exit(result);
  });
