import execa from 'execa';
import chalk from 'chalk';

export default createReactApp;

async function createReactApp(options) {
  console.log(chalk.blue('Create React App is doing it\'s magic...'));

  const result = await execa('create-react-app', [
    options.title,
    options.lang === 'typescript' ? '--typescript' : ''
  ]);

  if (result.failed) {
    return Promise.reject(new Error('Failed to run create-react-app'));
  }
  return;
}
