const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
  rootDir: './',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' } ),
};
