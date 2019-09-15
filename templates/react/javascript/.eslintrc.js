module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-var': 'off',
    'vars-on-top': 'off',
    'func-names': 'off',
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
    'react/forbid-prop-types': "off",
    'react/prop-types': ["error", { "ignore": "children"}]
  },
  plugins: ['prettier'],
  env: {
    browser: true,
    node: true,
    jest: true
  },
  settings: {}
};
