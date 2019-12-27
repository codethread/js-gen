const chalk = require('chalk');
const execa = require('execa');
const ora = require('ora');

module.exports = dependencies;

const devDeps = {
  common: [
    "eslint",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "prettier",
  ],
  node: {
    common: [
      "nodemon",
      "jest",
      "eslint-config-airbnb-base",
    ],
    javascript: [],
    typescript: [
      "@types/jest",
      "@typescript-eslint/eslint-plugin",
      "@typescript-eslint/parser",
      "concurrently",
      "eslint-import-resolver-alias",
      "ts-jest",
    ]
  },
  react: {
    common: ["eslint-config-airbnb"],
    javascript: [],
    typescript: [
      '@typescript-eslint/parser',
      '@typescript-eslint/eslint-plugin',
    ],
  }
}

const deps = {
  common: [],
  node: {
    common: [],
    javascript: [],
    typescript: [
      "typescript",
      "@types/node",
      "module-alias",
    ],
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

  const airbnbPack = project === 'node' ? 'eslint-config-airbnb-base@latest' : 'eslint-config-airbnb@latest';
  logger.info(`fetching ${airbnbPack} peer dependencies`)

  const { stdout } = await execa('npm', [
    'info', airbnbPack, 'peerDependencies', '--json'
  ]);

  const airbnbDeps = Object.keys(JSON.parse(stdout)) // .filter(dep => dep !== 'eslint');

  logger.info('airbnb dependencies:')
  logger.table(airbnbDeps)

  const devDepsL = [
    ...devDeps.common,
    ...devDeps[project].common,
    ...devDeps[project][lang],
    ...airbnbDeps
  ].sort();

  logger.info('all dev dependencies:')
  logger.table(devDepsL)

  console.log('\nInstalling Dependencies...')

  await asyncForEach(depsL, async dep => {
    const spinner = ora(dep).start();
    await execa('yarn', ['add', dep], { cwd: title })
    spinner.succeed();
  })

  await asyncForEach(devDepsL, async dep => {
    const spinner = ora(dep).start();
    const res = await execa('yarn', ['add', '-D', dep], { cwd: title })
    spinner.succeed();
  })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
