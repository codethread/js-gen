import fs from 'fs';
import { promisify } from 'util';

export default packageJson;

// react creates its own package.json, so only language matters
function packageJson({ title: cwd, node_version, language, logger }) {
  logger.info('constructing package.json in folder: ', cwd);
  const isTypescript = language.toLowerCase() === 'typescript'
  logger.info(`using template isTypescript: ${isTypescript}`);

  const pj = {
    name: cwd,
    version: '1.0.0',
    description: '',
    main: isTypescript ? 'dist/app.js' : 'src/app.js',
    ...(isTypescript && {
      "_moduleAliases": {
        "@utils": "dist/utils"
      },
    }),
    scripts: {
      "start": "NODE_ENV=PROD node src/app.js",
      "nuke": "git clean -dfX",
      "test": "NODE_ENV=TEST jest",
      ...(isTypescript ? {
        "dev": "NODE_ENV=DEV concurrently -k -c cyan.bold,green.bold -p [{name}] -n TypeScript,Node npm:watch-ts npm:watch-node ",
        "lint": "eslint src/**/*.{ts,tsx}",
        "lint-fix": "eslint --fix src/**/*.{ts,tsx}",
        "predev": "tsc",
        "watch-node": "NODE_ENV=DEV nodemon dist/app.js",
        "watch-ts": "tsc --watch"
      } : {
          "dev": "NODE_ENV=DEV nodemon src/app.js",
          "lint": "eslint src/**/*.{js,jsx}",
          "lint-fix": "eslint --fix src/**/*.{js,jsx}"
        })
    },
  };
  const asString = JSON.stringify(pj, null, 2)
  logger.info('packageJson:', asString);
  return promisify(fs.writeFile)(`${cwd}/package.json`, asString)
}
