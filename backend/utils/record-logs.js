//
// Importar o Winston
// Import Winston
//
const winston = require('winston');

//
// Níveis personalizados para todas operações
// Customised levels for all operations
//
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    conversion: 3
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    conversion: 'blue'
  }
};

//
// Criar um logger com duas opções de transporte (console e ficheiro)
// Create a logger with two transport options (console and file)
//
const logger = winston.createLogger({
  level: customLevels.levels, // Define o nível mínimo de log (ex: 'info', 'warn', 'error')
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}], ${level}: ${message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

winston.addColors(customLevels.colors);

module.exports = logger;