import chalk from 'chalk';
import { name, version } from '../package.json';

export default getVersion;

function getVersion() {
  console.log(chalk.cyan(name), 'version:', chalk.yellow(version));
}
