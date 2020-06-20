module.exports = {
  'collectCoverage': true,
  'collectCoverageFrom': ['src/**/*'],
  'coverageDirectory': 'coverage',
  'coverageThreshold': {
    'global': {
      'branches': 100,
      'functions': 100,
      'lines': 100,
      'statements': 100
    }
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/junit/unit/',
      outputName: 'test-results.xml',
    }]
  ],
  'roots': [
    '<rootDir>/src'
  ],
  'transform': {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  'testRegex': '.*(test|spec)\\.(t|j)sx?$',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
}
