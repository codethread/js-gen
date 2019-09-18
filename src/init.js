import fs from 'fs';
import chalk from 'chalk';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

import git from './init.d/git';
import dependencies from './init.d/dependencies';
import nodeVersion from './init.d/nodeVersion';
import packageJson from './init.d/packageJson';
import createReactApp from './init.d/createReactApp';

export async function init(options_raw) {
  const cwd = options_raw.title;
  const project = options_raw.project.toLowerCase()
  const lang = options_raw.language.toLowerCase()

  const options = { ...options_raw, title: cwd, project, lang };
  const copyFiles = copyTemplateFiles(cwd);

  try {

    project === 'react' && await createReactApp(options)
    project === 'node' && await packageJson(options);

    await copyFiles(getTemplates('common'));
    await copyFiles(getTemplates(`${project}/common`));
    await copyFiles(getTemplates(`${project}/${lang}`));

    await git(cwd);
    await nodeVersion(options);
    await dependencies(options);

    console.log('%s Project ready', chalk.green.bold('DONE'));

  } catch(e) {
    console.error(e);
  }
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
