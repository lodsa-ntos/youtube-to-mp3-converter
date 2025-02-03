//
// Importar o Winston
// Import Winston
//
const winston = require('winston');

const fs = require('fs');
const path = require('path');

// Criar um diretório para armazenar os ficheiros de log
// Create a directory to store log files
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
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

// Adicionar as cores personalizadas ao Winston
// Add custom colours to Winston
winston.addColors(customLevels.colors);

//
// Criar um logger com duas opções de transporte (console e ficheiro)
// Create a logger with two transport options (console and file)
//
const logger = winston.createLogger({
  level: 'info', // Define o nível mínimo de log (ex: 'info', 'warn', 'error')
  levels: customLevels.levels, // Define os níveis personalizados | Define custom levels
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}], ${level}: ${message}`;
    })
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'app.log') })
  ]
});

module.exports = logger;