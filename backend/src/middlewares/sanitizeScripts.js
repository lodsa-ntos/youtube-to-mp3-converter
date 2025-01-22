//
// Importações e configurações.
// Imports and configurations.
//
const xss = require('xss');
const logger = require('../helpers/record-logs');

//
// Função para sanitizar entradas (evitar XSS)
// Function to sanitise entries (prevent XSS)
//
const sanitizeInpunt = (input) => {
  // Limpa a entrada para prevenir injeção de scripts
  // Clear input to prevent script injection
  logger.info(`Sanitizing input: ${input}`);
  return xss(input);
};

module.exports = sanitizeInpunt;