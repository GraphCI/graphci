const yaml = require('js-yaml');
const denodeify = require('denodeify');
const readFile = denodeify(require('fs').readFile);
const buildDag = require('./src/build-dag');
const runDag = require('./src/run-dag');

const filename = process.argv[2];

readFile(`${filename}.yaml`, 'utf8')
  .then(yaml.safeLoad)
  .then((stages) => buildDag(stages, filename))
  .then(runDag)
  .catch(console.error);
