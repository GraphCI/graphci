const getOptions = require('./cli-options');

const debug = (...log) => {
  if (getOptions().debug) {
    console.log(...log);
  }
};

module.exports = { debug };
