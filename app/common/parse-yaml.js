const denodeify = require('denodeify');
const glob = denodeify(require('glob'));
const readFile = denodeify(require('fs').readFile);
const yaml = require('js-yaml');

const { base, collapseMeta } = require('./meta');
const fetchSubgraphs = require('./subgraphs');

const parseYaml = ({ path, push }) =>
  glob(`${path}/**/*.graphci.yaml`, { ignore: ['**/node_modules/**'] })
    .then((files) => Promise.all(files.map((filename) => readFile(filename, 'utf8'))))
    .then((files) => files.map(yaml.safeLoad))
    .then(collapseMeta)
    .then(fetchSubgraphs)
    .then((files) => ({
      input: files.reduce((all, file) => Object.assign(base, all, file)),
      push,
    }));

module.exports = parseYaml;
