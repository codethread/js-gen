import arg from 'arg';
import {prompt} from './prompt';
import {init} from './init';

export async function cli(args) {
  try {
    const options = await prompt();
    init(options)
  } catch (e) {
    console.error(e);
  }
}
