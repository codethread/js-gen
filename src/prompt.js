const inquirer = require('inquirer');

module.exports = async function prompt() {
  const node_version = process.versions.node;

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
    {
      name: 'node_version',
      type: 'input',
      message: 'Select node version',
      ...(node_version && { default: node_version }),
    },
  ];


  let responses = await inquirer.prompt(questions);

  if (responses.project === 'Node') {
    const latestNode = '13.2.0';
    const nodeConfig = await inquirer.prompt([
      {
        name: 'harmonyFlags',
        type: 'checkbox',
        message: `Harmony flags? (will force node version to ${latestNode})`,
        choices: ['optionalChaining'],
      },
    ])
    responses = { ...responses, ...nodeConfig };

    if (nodeConfig.harmonyFlags) responses.node_version = latestNode;
  }

  return responses;
}
