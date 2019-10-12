# Js Gen ![npm (scoped)](https://img.shields.io/npm/v/@ahdesigns/js-gen)

Javascript/ Typescript boilerplate generator for node and/or react projects.

## Installation
```bash
$ npm i -g create-react-app
$ npm i -g @ahdesigns/js-gen
```

## Usage
```bash
# navigate to the parent directory where you want your project to live, e.g:
$ cd ~/dev

# run the generator command:
$ js-gen

# follow the prompts (including giving your project a name)
# once complete, you can cd into your newly created project directory, e.g:
$ cd ~/dev/name-of-project
```

## About

Inspired by [create react app](https://github.com/facebook/create-react-app), quickly generate the boilerplate to run a typescript or javascript project with an opinionated setup including:
- eslint (with optional typescript support)
- prettier
- jest (with `ts-jest` for typescript)
- tsconfig
- create-react-app for react projects
