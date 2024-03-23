module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true, // Ensures ESLint knows you're using ES2022 features
  },
  parserOptions: {
    ecmaVersion: 2022, // Set to the version of ECMAScript you are using
    sourceType: 'module', // Allows for the use of imports
  },
  extends: [
    'plugin:vue/essential', // or 'plugin:vue/recommended' for more comprehensive rules
    'eslint:recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
