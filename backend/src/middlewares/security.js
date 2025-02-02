//
// Importações e configurações.
// Imports and configurations.
//
const csrf = require('csurf');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../helpers/recordLogs');

const csrfProtection = csrf({ cookie: true });

// CORS configuration
const corsOptions = {
  // origin: 'http://your-frontend-domain.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// CORS middleware
const corsMiddleware = cors(corsOptions);

// Content Security Policy configuration
const setCSP = () => {
  logger.info('Setting Content Security Policy...');
  return helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://fonts.googleapis.com'],
      frameSrc: ["'self'", 'https://accounts.google.com']
    },
  });
};

module.exports = {
  csrfProtection,
  corsMiddleware,
  setCSP
};