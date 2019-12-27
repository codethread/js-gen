const chalk = require('chalk');
const { name, version } = require('../package.json');

module.exports = getVersion;

function getVersion() {
  console.log(chalk.cyan(name), 'version:', chalk.yellow(version));
}
