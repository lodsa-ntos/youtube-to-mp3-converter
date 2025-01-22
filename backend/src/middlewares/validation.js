//
// Importações e configurações.
// Imports and configurations.
//
const validator = require('validator');
const logger = require('../helpers/record-logs');

//
// Função para validar URLs
// Function to validate URLs
//
const validateUrl = (url) => {
  logger.info(`Validating URL: ${url}`);
  return validator.isURL(url, { require_protocol: true });
};

module.exports = validateUrl;