const denodeify = require('denodeify');
const glob = denodeify(require('glob'));
const readFile = denodeify(require('fs').readFile);
const yaml = require('js-yaml');

const base = {
  meta: { tags: [] },
};

const parseYaml = ({ path, push }) =>
  glob(`src/server/${path}/**/*.dockercise.yaml`, { ignore: ['**/node_modules/**'] })
    .then((files) => Promise.all(files.map((filename) => readFile(filename, 'utf8'))))
    .then((files) => files.map(yaml.safeLoad))
    .then((files) => ({
      input: files.reduce((all, file) => Object.assign(base, all, file)),
      push,
    }));

module.exports = parseYaml;
