import {prompt} from './prompt';
import {init} from './init';
import checkNodenv from './validateNode';

export async function cli(args) {
  try {
    checkNodenv();
    const options = await prompt();
    init(options)
  } catch (e) {
    console.error(e);
  }
}
