const chalk = require('chalk');
const semver = require('semver');
const { engines } = require('../package.json');

module.exports = checkNodenv;

function checkNodenv() {
  const nodeVersion = engines.node;

  if (!semver.satisfies(process.version, nodeVersion)) {
      console.log(chalk.red('NodeJS Version Check Failed'));
      console.log(`Required node version ${chalk.yellow(nodeVersion)}`)
      console.log(`NOT SATISFIED with current version ${ chalk.red(process.version) }.`);
      console.log(`
This is the version of node executing js-gen,
not the version of node that will be used by your generated app.

You may need to change your ${chalk.cyan('global node version')} and rerun
npm install -g @ahdesigns/js-gen`)
    process.exit(1);
  }
}
