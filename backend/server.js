// Carregar as variáveis de ambiente
// Load the environment variables
require('dotenv').config();

// Importar a aplicação Express configurada
// Import the configured Express application
const app = require('./src/app');
const logger = require('../backend/src/helpers/recordLogs');

// Definir a Porta do servidor e tentar usar a PORTA definida na variável ambiente (process.env.PORT)
// Set the server PORT and try to use the PORT defined in the environment variable
const PORT = process.env.PORT || 3000;

// Iniciar o servidor e escutar a porta
// Start the server and listen to the port
app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
    console.log(`Server is running on port http://localhost:${PORT}`);
});