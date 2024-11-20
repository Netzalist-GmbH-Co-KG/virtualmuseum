import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/server.ts', 
    '!src/types/**/*.{js,ts}', 
    '!src/**/*.d.ts', 
    '!src/controllers/**/*.{js,ts}', 
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 50,
      functions: 70,
      lines: 75,
    },
    './src/services/': {
      statements: 80,
      branches: 65,
      functions: 75,
      lines: 80,
    },
    './src/middleware/': {
      statements: 90,
      branches: 80,
      functions: 90,
      lines: 90,
    }
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
};

export default config;
