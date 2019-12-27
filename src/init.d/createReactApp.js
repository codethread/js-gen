const execa = require('execa');
const chalk = require('chalk');

module.exports = createReactApp;

async function createReactApp(options) {
  try {
    console.log(chalk.blue('Create React App is doing it\'s magic...'));

    const result = await execa('create-react-app', [
      options.title,
      options.lang === 'typescript' ? '--typescript' : ''
    ]);

    options.logger.info('create react app complete')
  } catch (e) {
    console.log(chalk.red('create-react-app'), ' not installed');
    console.log('run:', chalk.cyan('npm i -g create-react-app'), 'to use react features');
    process.exit(1);
  }
}
