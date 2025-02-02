// Importações e configurações.
// Imports and configurations.
const express = require('express');
const cookieParser = require('cookie-parser');
const { csrfProtection, corsMiddleware, setCSP } = require('../src/middlewares/security');
const convertRoutes = require('./routes/convertLinkRouter');
const logger = require('./helpers/recordLogs');

// Instanciar todos os métodos e propriedades do Express
// Instantiate all Express methods and properties
const app = express();

// Middleware para processar cookies
// Middleware to process cookies
app.use(cookieParser());

// Middleware para processar os pedidos como JSON
// Middleware to process the requests as JSON
app.use(express.json());

// Log antes de validar o CSRF
// Log before validating CSRF
app.use((req, res, next) => {
  logger.info("CSRF Token no corpo: ", req.body._csrf);
  console.log("CSRF Token no cabelçalho: ", req.headers['csrf-token']);
  next();
});

// Middleware de segurança
// Security middleware
app.use(csrfProtection);
app.use(corsMiddleware);
app.use(setCSP());

// Rota para obter o token CSRF
// Route to get the CSRF token
app.get("/csrf-token", (req, res) => {
  logger.info("Received request for CSRF token.");
  res.json({ csrfToken: req.csrfToken() });
});

// Rota protegida por CSRF
// CSRF-protected route
app.post("/protected-route", (req, res) => {
  logger.info("Received request to protected route.");
  res.json({ message: "CSRF token is valid." });
});

// Rota de teste
// Test route
app.post('/api/test', (req, res) => {
  res.send('Test route reached');
});

// Middleware para depuração de rotas
app.use((req, res, next) => {
  logger.info(`Route called: ${req.method} ${req.originalUrl}`);
  console.log(`Rota chamada: ${req.method} ${req.originalUrl}`)
  next();
});

// Define que as rotas da API começarão com '/api' para converter o vídeo
// Defines that API routes will start with '/api' to convert the video
app.use('/api', convertRoutes);

// Rota principal
// Main route
app.use('/', (req, res) => {
  logger.info('API is running...');
  res.status(200).send('API is running...');
});

// Exportar a instância do Express (app) para ser utilizada em outros ficheiros
// Export the Express instance (app) to be used in other files
module.exports = app;