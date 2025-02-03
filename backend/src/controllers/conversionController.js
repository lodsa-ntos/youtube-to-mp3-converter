const conversion = require("../models/conversionModel");
const logger = require("../helpers/recordLogs");

//* Função para criar uma nova conversão
//* Function to create a new conversion
const createConversion = async (req, res) => {

  const { videoUrl } = req.body;

  try {
    
    // Validação do campo obrigatório
    // Validation of the required field
    if (!videoUrl) {
      logger.error("Video URL is required.");
      return res.status(400).json({ message: "Video URL is required." });
    }

    // Criar um registo na base de dados
    // Create a record in the database
    const newConversion = await conversion.create({ videoUrl });
    logger.info(`New conversion created with ID: ${newConversion._id}`);
  
    return res.status(201).json({
      message: "Conversion created successfully.",
      conversion: newConversion,
    });
  } catch (error) {
    logger.error('Error creating conversion: ', error);
    return res.status(500).json({ error: "Error creating conversion." });
  }
};

//* Atualizar o estado de uma conversão
//* Update the state of a conversion
const updateConversion = async (req, res) => {
  
  const { requestId } = req.params;
  const { status, mp3Url, errorMessage } = req.body;

  try {
    
    // Validação do campo obrigatório
    // Validation of the required field
    if (!requestId) {
      logger.error("Request ID is required.");
      return res.status(400).json({ message: "Request ID is required." });
    }

    if (!['pending', 'completed', 'error'].includes(status)) {
      logger.error("Invalid status value.");
      return res.status(400).json({ message: "Invalid status value." });
      
    }

    // Atualizar oregisto na base de dados
    // Update the record in the database
    const updatedConversion = await conversion.findByIdAndUpdate(
      requestId,
      { status, mp3Url, errorMessage },
      { new: true, runValidators: true }
    );

    // Verificar se a conversão existe
    // Check if the conversion exists
    if (!updatedConversion) {
      logger.error('Conversion not found.');
      return res.status(404).json({ error: "Conversion not found." });
    }

    logger.info(`Conversion updated: ${updatedConversion._id}`);
  
    return res.status(200).json({
      message: "Conversion updated successfully.",
      conversion: updatedConversion,
    });
  } catch (error) {
    logger.error('Error updating conversion: ', error);
    return res.status(500).json({ error: "Error updating conversion." });
  }
};

//* Obter todas as conversões
//* Get all conversions
const getConversionStatus = async (req, res) => {
  const { requestId } = req.params;

  try {

    // Validação do campo obrigatório
    // Validation of the required field
    if (!requestId) {
      logger.error("Request ID is required.");
      return res.status(400).json({ message: "Request ID is required." });
    }

    const conversion = await conversion.findById(requestId);

    // Verificar se a conversão existe
    // Check if the conversion exists
    if (!conversion) {
      logger.error('Conversion not found.');
      return res.status(404).json({ error: "Conversion not found." });
    }

    logger.info(`Retrieved conversion status for ID: ${conversion._id}`);
    return res.status(200).json(conversion);
  } catch (error) {
    logger.error('Error retrieving conversion status: ', error);
    return res.status(500).json({ error: "Error retrieving conversion status." });
  }
};

module.exports = { createConversion, updateConversion, getConversionStatus };