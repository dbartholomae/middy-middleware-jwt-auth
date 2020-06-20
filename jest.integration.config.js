module.exports = {
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/junit/integration/',
      outputName: 'test-results.xml',
    }]
  ],
  'roots': [
    '<rootDir>/examples'
  ],
  'transform': {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  'testRegex': '.*int-(test|spec)\\.(t|j)sx?$',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
}
