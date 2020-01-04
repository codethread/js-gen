module.exports = {
    extends: [
        'react-app',
        'prettier',
        'plugin:prettier/recommended',
    ],
    rules: {
        'react/forbid-prop-types': "off",
        'react/prop-types': ["error", { "ignore": ["children"]}],
    },
};
