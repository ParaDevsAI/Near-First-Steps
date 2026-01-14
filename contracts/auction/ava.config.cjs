module.exports = {
  timeout: '300000',
  files: ['tests/**/*.test.js'],
  failWithoutAssertions: false,
  extensions: {
    js: true
  },
  nodeArguments: [
    '--no-warnings'
  ]
};
