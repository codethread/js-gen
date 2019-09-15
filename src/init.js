import fs from 'fs';
import chalk from 'chalk';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';

export async function init(options_raw) {
  const cwd = options_raw.title;
  const project = options_raw.project.toLowerCase()
  const lang = options_raw.language.toLowerCase()
  const options = { ...options_raw, title: cwd, project, lang };

  const copyFiles = copyTemplateFiles(cwd);

  const configFromOptions = `${project}/${lang}`

  try {
    await copyFiles(getTemplates('common'));
    await copyFiles(getTemplates(configFromOptions));
    await initGit(cwd);
    await nodeVersion(options);
    project === 'node' && await createPackageJson(options);
    await installDependencies(options);

    console.log('%s Project ready', chalk.green.bold('DONE'));

  } catch(e) {
    console.error(e);
  }
}

async function initGit(cwd) {
  const result = await execa('git', ['init'], { cwd });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}

async function installDependencies({ project, lang, title }) {
  const devDeps = {
    common: [
      "eslint@5.9.0",
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
      typescript: [],
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


  const { stdout } = await execa('npm', ['info',  "eslint-config-airbnb-base@latest",  'peerDependencies', '--json'])
  if (!stdout) {
    return Promise.reject(new Error('Failed to fetch dependencies for airbn'));
  }
  const airbnbDeps = Object.keys(JSON.parse(stdout)).filter(dep => dep !== 'eslint');

  const devDepsL = [
    ...devDeps.common,
    ...devDeps[project].common,
    ...devDeps[project][lang],
    ...airbnbDeps
  ].sort();

  console.log(chalk.blue('Installing Dependencies...'));
  console.table(depsL);

  const depsResult = await execa('yarn', ['add', ...depsL], { cwd: title })

  console.log(chalk.blue('Installing Dev Dependencies...'));
  console.table(devDepsL);

  const devDepsResult = await execa('yarn', ['add', '-D', ...airbnbDeps, ...devDepsL], { cwd: title })

  if (depsResult.failed || devDepsResult.failed) {
    return Promise.reject(new Error('failed to install Dependencies'));
  }
}

function nodeVersion({ title: cwd, node_version }) {
  return promisify(fs.writeFile)(`${cwd}/.node-version`, node_version)
}

function createPackageJson({ title: cwd, node_version, language }) {
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

// --------------------------------------------
// utils
// --------------------------------------------

function copyTemplateFiles(target) {
  return template => promisify(ncp)(template, target, { clobber: true });
}

function getTemplates(dir) {
  return path.resolve(__dirname, '../templates', dir);
}
