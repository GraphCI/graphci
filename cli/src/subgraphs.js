const yaml = require('js-yaml');
const uniq = require('lodash/uniq');
const stream = require('stream');
const startDocker = require('./docker');

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

const fetchSubgraphs = (files) => {
  const toFetch = uniq(files
                    .reduce((subs, sub) => subs.concat(sub.meta && sub.meta.subgraphs), [])
                    .filter((x) => x));

  return Promise.all(toFetch.map((subgraph) => {
    console.info(`Fetching subgraph "${subgraph}"`);

    const [dockerOutputStream, getContent] = makeStream();

    return docker.pull(subgraph)
      .then(() => docker.run(subgraph, [], dockerOutputStream))
      .then(getContent)
      .then(yaml.safeLoad);
  }))
  .then((fetchedSubgraphs) => files.concat(...fetchedSubgraphs));
};

module.exports = fetchSubgraphs;
