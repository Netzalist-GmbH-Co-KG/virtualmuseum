import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../.env.test') });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.API_KEY = 'test-api-key';

// Global test timeout
jest.setTimeout(10000);

// Suppress console output during tests
if (process.env.JEST_SILENT) {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    console.debug = jest.fn();
}

// Add custom matchers if needed
expect.extend({
    // Add custom matchers here
});
