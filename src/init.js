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

  const options = { ...options_raw, cwd, project, lang };

  options.logger.info('cwd', cwd);
  options.logger.info('project', project);
  options.logger.info('lang', lang);

  const copyFiles = copyTemplateFiles(options);

  try {
    options.logger.info('creating dir: ', cwd);

    await fs.promises.mkdir(cwd, { recursive: true });

    project === 'react' && await createReactApp(options)
    project === 'node' && await packageJson(options);

    options.logger.info('copying files...');
    await copyFiles(getTemplates('common'));
    await copyFiles(getTemplates(`${project}/common`));
    await copyFiles(getTemplates(`${project}/${lang}`));

    await git(options);
    await nodeVersion(options);
    await dependencies(options);

    console.log('%s Project ready', chalk.green.bold('DONE'));
    console.log(chalk.cyan(`cd ${cwd}`));
    console.log(chalk.cyan('yarn dev'));

  } catch(e) {
    console.error(e);
  }
}

// --------------------------------------------
// utils
// --------------------------------------------

function copyTemplateFiles({ cwd: target, logger }) {
  return template => {
    logger.info('creating template: ', template);
    logger.info('in target', target);
    return promisify(ncp)(template, target, { clobber: true });
  }
}

function getTemplates(dir) {
  return path.resolve(__dirname, '../templates', dir);
}
