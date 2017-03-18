#! /usr/bin/env node

const yaml = require('js-yaml');
const denodeify = require('denodeify');
const readFile = denodeify(require('fs').readFile);
const buildDag = require('./src/build-dag');
const runDag = require('./src/run-dag');
const glob = denodeify(require('glob'));

glob('**/*.dockercise.yaml')
  .then((files) => Promise.all(files.map((filename) => readFile(filename, 'utf8'))))
  .then((files) => files.map(yaml.safeLoad))
  .then((files) => files.reduce((all, file) => Object.assign({}, all, file)), {})
  .then((stages) => buildDag(stages, 'dockercise'))
  .then(runDag)
  .then(([runId, result]) => {
    console.log(`Run completed: ${runId}`);
    process.exit(result);
  });
