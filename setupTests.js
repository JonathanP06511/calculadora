// setupTests.js
require('jest-fetch-mock').enableMocks();

// Opcional: Puedes configurar los mocks de fetch aquí si es necesario
global.fetch = jest.fn();
