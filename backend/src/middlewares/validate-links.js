//
// Função para validar o URL 
// Fnction to validate the URL

const logger = require("../helpers/record-logs");

//
const validateUrl = (url) => {
  logger.info(`Validating URL: ${url}`);
  return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
}

module.exports = { validateUrl };