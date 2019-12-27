const inquirer = require('inquirer');

module.exports = function prompt() {
  const questions = [
    {
      name: 'title',
      type: 'input',
      message: 'Name your project (kebab-case):',
      default: 'new-project',
    },
    {
      name: 'language',
      type: 'list',
      message: 'Choose a language:',
      choices: ['JavaScript', 'TypeScript'],
      default: 'JavaScript',
    },
    {
      name: 'project',
      type: 'list',
      message: 'Choose a project:',
      choices: ['Node', 'React'],
      default: 'Node',
    },
    // {
    //   name: 'git',
    //   type: 'confirm',
    //   message: 'Initialize a git repository?',
    //   default: true,
    // }
  ]

  const node_version = process.versions.node;
  if (node_version) {
    questions.push({
      name: 'node_version',
      type: 'input',
      message: 'Select node version',
      default: node_version,
    })
  }

  return inquirer.prompt(questions);
}
