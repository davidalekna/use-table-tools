const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
];

module.exports = {
  testPathIgnorePatterns: [...ignores],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  coveragePathIgnorePatterns: [...ignores],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
