import execa from 'execa';

export default git;

async function git({ cwd, logger }) {
  logger.info('initialising git project')
  const result = await execa('git', ['init'], { cwd });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}
