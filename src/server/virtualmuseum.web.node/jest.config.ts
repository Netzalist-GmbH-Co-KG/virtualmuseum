import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  forceExit: true,
  detectOpenHandles: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,js}',
    '!<rootDir>/src/server.ts',
    '!<rootDir>/src/types/**',
    '!<rootDir>/src/config/**',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/controllers/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageProvider: 'v8',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};

export default config;
