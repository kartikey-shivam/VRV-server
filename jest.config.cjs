require('dotenv').config({ path: '.env.test' });

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    transformIgnorePatterns: ['/node_modules/'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    globalTeardown: './jest.globalTeardown.js',
    testTimeout: 30000,
    verbose: true,
    detectOpenHandles: true,
    forceExit: true
};
