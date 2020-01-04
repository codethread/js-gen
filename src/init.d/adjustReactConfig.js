const fs = require('fs');
const { exec } = require('child_process');

module.exports = function adjustReactConfig({ logger, title: cwd, lang }) {
    const isTypescript = lang === 'typescript';

    logger.info('adjusting react config');
    logger.info('adjusting package json');
    const pj = getJson('package');

    logger.info('removing eslintConfig');
    delete pj.eslintConfig;

    logger.info('adding lint commands');
    pj.scripts = {
        ...pj.scripts,
        lint: `eslint --ext ${isTypescript ? 'ts,tsx' : 'js,jsx'} ./src`,
        'lint:fix': 'npm run lint -- --fix'
    }

    writeJson('package', pj);

    if (!isTypescript) return;

    logger.info('adjusting tsconfig');
    const tsconfig = getJson('tsconfig');

    logger.info('pointing base url at src');
    tsconfig.compilerOptions.baseUrl = 'src/'

    writeJson('tsconfig', tsconfig);


    // quick dirty way to add line to start of file
    exec(`echo "/* eslint-disable @typescript-eslint/explicit-function-return-type */
$(cat src/serviceWorker.ts)" > src/serviceWorker.ts`, { cwd });


    function getJson(f) {
        return JSON.parse(fs.readFileSync(`${cwd}/${f}.json`));
    }

    function writeJson(f, data) {
        fs.writeFileSync(`${cwd}/${f}.json`, JSON.stringify(data, null, 2));
    }
}
