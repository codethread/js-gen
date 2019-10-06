module.exports = {
  parser:  '@typescript-eslint/parser',
  parserOptions:  {
    project: './tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  rules: {
    'default-case': 'off',
    'no-var': 'off',
    'vars-on-top': 'off',
    'func-names': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/explicit-function-return-type': 0
  },
  plugins: [
    'prettier',
    '@typescript-eslint'
  ],
  env: {
    node: true,
    jest: true
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          // For path aliases, add to tsconfig, package.json and eslintrc...
          ['@utils', './src/utils']
        ],
        extensions: ['.js', '.ts']
      },
      node: {
        extensions: ['.js', '.ts']
      }
    }
  },
}
