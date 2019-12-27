const {prompt} = require('./prompt');
const {init} = require('./init');
const checkNodenv = require('./validateNode');
const execa = require('execa');
const logger = require('./logger');
const version = require('./version');

module.exports = async function cli(args) {
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
