import fs from 'fs';
import { promisify } from 'util';

export default nodeVersion;

function nodeVersion({ title: cwd, node_version }) {
  return promisify(fs.writeFile)(`${cwd}/.node-version`, node_version)
}
