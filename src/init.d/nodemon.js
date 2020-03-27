
const fs = require('fs');
const { promisify } = require('util');
module.exports = nodemon;

function nodemon({ lang, logger, title: cwd }) {
    logger.info('constructing nodemon in folder: ', cwd);
    const isTypescript = lang === 'typescript';
    logger.info(`using template isTypescript: ${isTypescript}`);

    const dir = "src/",

    const f = {
        watch: [dir],
        env: {
            "NODE_ENV": "dev",
            "NODE_PATH": dir
        },
        ...(isTypescript && { exec: 'ts-node ./src/index.ts' }),
        ext: `${isTypescript ? 'ts' : 'js'} json`
    }
    const asString = JSON.stringify(f, null, 2)
    logger.info('nodemon.json:', asString);
    return promisify(fs.writeFile)(`${cwd}/nodemon.json`, asString);
}
