import arg from 'arg';
import inquirer from 'inquirer';

function prompt() {
  const questions = [
    {
      name: 'title',
      type: 'input',
      message: 'Please name your project (kebab-case)',
      default: 'new-project',
    },
    {
      name: 'language',
      type: 'list',
      message: 'Please choose a language',
      choices: ['JavaScript', 'TypeScript'],
      default: 'JavaScript',
    },
    {
      name: 'project',
      type: 'list',
      message: 'Please choose which project template to use',
      choices: ['Node', 'React'],
      default: 'Node',
    },
    {
      name: 'git',
      type: 'confirm',
      message: 'Initialize a git repository?',
      default: true,
    }
  ]

  return inquirer.prompt(questions);
}

export async function cli(args) {
  try {
    const options = await prompt();
    console.log(options);
  } catch (e) {
    console.error(e);
  }
}
