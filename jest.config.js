const { TextEncoder, TextDecoder } = require('util');

module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['text-encoding'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Puedes crear este archivo si necesitas configuración adicional
  globals: {
    TextEncoder,
    TextDecoder,
  },
};
