const fs = require('fs');
const { promisify } = require('util');

module.exports = packageJson;

// react creates its own package.json, so only language matters
function packageJson({ title: cwd, node_version, lang, project, logger, harmonyFlags = [] }) {
  logger.info('constructing package.json in folder: ', cwd);
  const isTypescript = lang === 'typescript'
  const isReact = lang === 'react'
  const dir = isTypescript ? "dist/" : "src/";
  logger.info(`using template isTypescript: ${isTypescript}`);

  const fileExtensions = [isTypescript ? 'ts' : 'js'];
  if (isReact) fileExtensions.push(isTypescript ? 'tsx' : 'jsx');

  const pj = {
    name: cwd,
    version: '1.0.0',
    description: cwd,
    scripts: {
      "start": `NODE_PATH=${dir} node${harmonyFlags.includes('optionalChaining') ? ' --harmony-optional-chaining' : ''} ${dir}index.js`,
      "test": "NODE_ENV=TEST jest",
      ...(isTypescript ? {
        "dev": "concurrently -k -c cyan.bold,green.bold -p [{name}] -n TypeScript,Node 'npm:watch:ts -- --preserveWatchOutput' 'npm:watch:js -- --delay 2.5'",
        "watch:js": "nodemon",
        "watch:ts": "tsc -w --project tsconfig.app.json",
      } : {
          "dev": "nodemon",
        }),
      "lint": `eslint ${fileExtensions.map(ext => '--ext .' + ext)} --config ./.eslintrc.js ./src ./test`,
      "lint:fix": "npm run lint -- --fix",
      "nuke": "git clean -dfX",
    },
  };
  const asString = JSON.stringify(pj, null, 2)
  logger.info('packageJson:', asString);
  return promisify(fs.writeFile)(`${cwd}/package.json`, asString)
}
