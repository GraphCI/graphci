const yaml = require('js-yaml');
const uniq = require('lodash/uniq');
const stream = require('stream');
const startDocker = require('./docker');
const pullImage = require('./pull-image');

const docker = startDocker();

const makeStream = () => {
  const bufs = [];
  const s = stream.PassThrough();
  let content;
  s.on('data', (d) => { bufs.push(d); });
  s.on('end', () => {
    content = Buffer.concat(bufs).toString();
  });

  return [s, () => content];
};

const fetchSubgraphs = (files = []) => {
  const toFetch = uniq(files.reduce((subs, sub) => subs.concat(sub.meta && sub.meta.subgraphs), [])
         .filter((x) => x));

  if (files.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(toFetch.map((subgraph) => {
    console.info(`Fetching subgraph "${subgraph}"`);

    const [dockerOutputStream, getSubgraph] = makeStream();

    return pullImage(subgraph)
      .then(() => docker.run(subgraph, [], dockerOutputStream))
      .then(getSubgraph)
      .then(yaml.safeLoad);
  }))
  .then((fetchedSubgraphs) => (
    fetchSubgraphs(fetchedSubgraphs).then((more) => (
      files.concat(...fetchedSubgraphs).concat(...more)
    ))
  ));
};

module.exports = fetchSubgraphs;
