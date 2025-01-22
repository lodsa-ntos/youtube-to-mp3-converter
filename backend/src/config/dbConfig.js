const mongoose = require('mongoose');

// Configuração das variáveis de ambiente
// Configuration of environment variables
require('dotenv').config();

const logger = require('../helpers/recordLogs')

const connectDB = async () => {
  try {
    // Configuração global do Mongoose para desativar a verificação de esquema
    // Global Mongoose configuration to disable schema verification
    mongoose.set('strictQuery', false);

    // Conectar ao MongoDB
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed: ', error.message);
    throw new Error("MongoDB connection failed: ", error.message);
  }

  // Fechar a conexão com o MongoDB quando a aplicação for encerrado
  // Close MongoDB connection when the app is terminated
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  });
};

module.exports = connectDB;