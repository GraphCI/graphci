const program = require('commander');

program
  .version(require('../package.json').version)
  .option('-d, --debug', 'Debug logging')
  .option('-q, --quiet', 'Do not log console output from node output')
  .command('graphci [targets...]');

program.parse(process.argv);

module.exports = () => program;
