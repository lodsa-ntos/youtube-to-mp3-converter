// Importações e configurações.
// Imports and configurations.
const express = require('express');
const { csrfProtection, corsMiddleware, setCSP } = require('../src/middlewares/security');
const convertRoutes = require('./routes/convert-link-router');
const logger = require('./helpers/record-logs');

// Instanciar todos os métodos e propriedades do Express
// Instantiate all Express methods and properties
const app = express();

// Middleware para processar os pedidos como JSON
// Middleware to process the requests as JSON
app.use(express.json());

// Middleware de segurança
// Security middleware
app.use(csrfProtection);
app.use(corsMiddleware);
app.use(setCSP());

// Rota principal
// Main route
app.use('/', (req, res) => {
  logger.info('API is running...');
  res.status(200).send('API is running...');
});

// Define que as rotas da API começarão com '/api' para converter o vídeo
// Defines that API routes will start with '/api' to convert the video
app.use('/api', convertRoutes);

// Exportar a instância do Express (app) para ser utilizada em outros ficheiros
// Export the Express instance (app) to be used in other files
module.exports = app;