import fs from 'fs';
import { promisify } from 'util';

export default nodeVersion;

function nodeVersion({ cwd, node_version, logger }) {
  logger.info('setting .node-version to: ', node_version)
  return promisify(fs.writeFile)(`${cwd}/.node-version`, node_version)
}
