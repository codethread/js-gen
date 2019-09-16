import fs from 'fs';
import { promisify } from 'util';

export default packageJson;

function packageJson({ title: cwd, node_version, language }) {
  const isTypescript = language.toLowerCase() === 'typescript'
  const pj = {
    name: cwd,
    version: '1.0.0',
    description: '',
    main: isTypescript ? 'dist/app.js' : 'src/app.js',
    scripts : isTypescript ? {
      "watch-node": "NODE_ENV=DEV nodemon dist/app.js",
      "watch-ts": "tsc --watch",
      "lint": "eslint src/**/*.{ts,tsx}",
      "lint-fix": "eslint --fix src/**/*.{ts,tsx}",
      "dev": "NODE_ENV=DEV concurrently -k -c cyan.bold,green.bold -p [{name}] -n TypeScript,Node npm:watch-ts npm:watch-node ",
      "predev": "tsc",
      "start": "NODE_ENV=PROD node src/app.js",
      "nuke": "git clean -dfX",
      "test": "NODE_ENV=TEST jest --watch"
    } : {
      "start": "NODE_ENV=PROD node src/app.js",
      "dev": "NODE_ENV=DEV nodemon src/app.js",
      "test": "NODE_ENV=TEST jest"
    },
    license: "ISC",
  };
  return promisify(fs.writeFile)(`${cwd}/package.json`, JSON.stringify(pj, null, 2))
}
