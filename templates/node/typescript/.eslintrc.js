module.exports = {
  parser:  '@typescript-eslint/parser',
  parserOptions:  {
    project: './tsconfig.json',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'no-var': 'off',
    'vars-on-top': 'off',
    'func-names': 'off',
    '@typescript-eslint/no-use-before-define': 0,
    'import/extensions': ['error', 'never', { json: 'always' }],
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
  ],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          // For path aliases, add to tsconfig and eslintrc...
          // If not a child of src, add parent folder to NODE_PATH env
          ['utils', './src/utils'],
          ['shared', './src/shared'],
          ['src', './src'],
          ['test', './test/utils'],
        ],
        extensions: ['.js', '.ts']
      },
      node: {
        extensions: ['.js', '.ts']
      }
    }
  },
}
