import {prompt} from './prompt';
import {init} from './init';
import checkNodenv from './validateNode';
import execa from 'execa';
import logger from './logger';
import version from './version';

export async function cli(args) {
  try {
    checkNodenv();

    if (args.includes('--version') || args.includes('-v')) {
      version();
      return;
    }
    const log = logger(args.includes('--debug'));

    log.info('js-gen startup')
    log.info('getting options')

    const options = await prompt();

    options.logger = log;
    options.logger.info('options: ', options)
    init(options)
  } catch (e) {
    console.error(e);
  }
}
