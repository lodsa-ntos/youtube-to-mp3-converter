//
// Importações e configurações.
// Imports and configurations.
//
const validator = require('validator');

// Função para validar URL do YouTube
// Function to validate YouTube URL
const validateYoutubeUrl = (url) => {
  const regex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return regex.test(url);
}

// Função para validar URL no geral
// Function to validate URL in general
const validateUrl = (url) => {
  return validator.isURL(url, { require_protocol: true });
};

module.exports = { validateYoutubeUrl, validateUrl }; ;