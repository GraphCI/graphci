#! /usr/bin/env node

const yaml = require('js-yaml');
const denodeify = require('denodeify');
const readFile = denodeify(require('fs').readFile);
const buildDag = require('./src/build-dag');
const runDag = require('./src/run-dag');
const glob = denodeify(require('glob'));
const colors = require('colors/safe');

const target = process.argv[2];
const debug = process.argv[3];

const base = {
  meta: { tags: [] },
};

glob('**/*.dockercise.yaml', { ignore: ['**/node_modules/**'] })
  .then((files) => Promise.all(files.map((filename) => readFile(filename, 'utf8'))))
  .then((files) => files.map(yaml.safeLoad))
  .then((files) => files.reduce((all, file) => Object.assign(base, all, file)), {})
  .then((stages) => buildDag(stages, target))
  .then((dag) => runDag(dag, debug, [target]))
  .then(([runId, result]) => {
    console.log(colors.green(`Run successful: ${runId}`));
    process.exit(result);
  });
