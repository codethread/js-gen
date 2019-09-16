import chalk from 'chalk';
import execa from 'execa';

export default dependencies;

async function dependencies({ project, lang, title }) {
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
        "concurrently",
        "babel-jest",
        "@babel/core",
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@typescript-eslint/eslint-plugin",
        "@typescript-eslint/parser",
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
      typescript: ["typescript", "@types/node"],
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


  const { stdout } = await execa('npm', [
    'info',
    project === 'node' ? 'eslint-config-airbnb-base@latest' :  'eslint-config-airbnb@latest',
    'peerDependencies', '--json'
  ])
  if (!stdout) {
    return Promise.reject(new Error('Failed to fetch dependencies for airbn'));
  }
  const airbnbDeps = Object.keys(JSON.parse(stdout)) // .filter(dep => dep !== 'eslint');

  const devDepsL = [
    ...devDeps.common,
    ...devDeps[project].common,
    ...devDeps[project][lang],
    ...airbnbDeps
  ].sort();

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
