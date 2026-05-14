module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/controllers/**/*.js',
    '!src/tests/**',
  ],
  coverageReporters: ['text', 'lcov'],
};
