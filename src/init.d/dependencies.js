const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

module.exports = dependencies;

const devDeps = {
    common: [
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "prettier",
    ],
    node: {
        common: [
            "nodemon",
            "jest",
            "eslint-config-airbnb-base",
            "eslint-import-resolver-alias",
        ],
        javascript: [],
        typescript: [
            "@types/jest",
            "@types/node",
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser",
            "ts-node",
            "ts-jest",
            "typescript",
        ]
    },
    react: {
        common: [],
        javascript: [],
        typescript: [],
    }
}

const deps = {
    common: [],
    node: {
        common: [],
        javascript: [],
        typescript: [],
    },
    react: {
        common: [],
        javascript: [],
        typescript: [],
    }
}

async function dependencies({ project, lang, title, logger }) {
    logger.info('setting up dependencies')

    const depsL = [
        ...deps.common,
        ...deps[project].common,
        ...deps[project][lang]
    ].sort();

    logger.info('dependencies:')
    logger.table(depsL)

    const devDepsL = [
        ...devDeps.common,
        ...devDeps[project].common,
        ...devDeps[project][lang],
    ].sort();

    if (project === 'node') {
        const airbnbPack = 'eslint-config-airbnb-base@latest';
        logger.info(`fetching ${airbnbPack} peer dependencies`)

        const { stdout } = await execa('npm', [
            'info', airbnbPack, 'peerDependencies', '--json'
        ]);

        const airbnbDeps = Object.keys(JSON.parse(stdout)) // .filter(dep => dep !== 'eslint');

        logger.info('airbnb dependencies:')
        logger.table(airbnbDeps)

        devDepsL.push(...airbnbDeps)
    }

    logger.info('all dev dependencies:')
    logger.table(devDepsL)

    if (depsL.length > 0) {
        await installer(depsL);
    }

    if (devDepsL.length > 0) {
        await installer(devDepsL, true);
    }

    async function installer(packages, isDev) {
        console.log('');
        const spinner = ora(`Installing ${isDev ? 'Dev ' : ''}Dependencies...`).start();
        console.log(packages.join('\n'));
        await execa('yarn', ['add', ...packages], { cwd: title })
        spinner.succeed();
    }
}
