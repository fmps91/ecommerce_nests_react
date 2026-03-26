import 'jest';

// Mock global console methods para tests
global.console = {
  ...console,
  // Silenciar logs en tests a menos que se necesite depurar
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configuración global para tests
beforeEach(() => {
  jest.clearAllMocks();
});
