import execa from 'execa';
import fs from 'fs';
import { promisify } from 'util';

export async function gitInit({ cwd, logger }) {
  logger.info('initialising git project')
  const result = await execa('git', ['init'], { cwd });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}

export async function gitIgnore({ cwd, logger }) {
  logger.info('creating gitignore file')
  const gitIgnoreString = `node_modules
build
dist
.env`;
  return promisify(fs.writeFile)(`${cwd}/.gitignore`, gitIgnoreString)
}
