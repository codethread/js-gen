import chalk from 'chalk';
import execa from 'execa';

export default dependencies;

async function dependencies({ project, lang, title, logger }) {
  logger.info('setting up dependencies')
  const devDeps = {
    common: [
      "eslint@5.16.0",
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

  if (!stdout) {
    return Promise.reject(new Error('Failed to fetch dependencies for airbnb'));
  }

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

  if (depsL.length > 0) {
    console.log(chalk.blue('Installing Dependencies...'));
    console.table(depsL);

    const depsResult = await execa('yarn', ['add', ...depsL], { cwd: title })

    if (depsResult.failed) {
      return Promise.reject(new Error('failed to install Dependencies'));
    }
  }

  if (devDepsL.length > 0) {
    console.log(chalk.blue('Installing Dev Dependencies...'));
    console.table(devDepsL);

    const devDepsResult = await execa('yarn', ['add', '-D', ...airbnbDeps, ...devDepsL], { cwd: title })

    if (devDepsResult.failed) {
      return Promise.reject(new Error('failed to install devDependencies'));
    }
  }
}
