const logger = require("../helpers/recordLogs");

// Mapa para armazenar o estado da conversão
// Map to store the conversion status
const downloadStatusMap = new Map();

//
// Endpoint GET /status
// Retorna o status atual da conversão, seja em andamento ou finalizado.
// Returns the current status of the conversion, either in progress or finalised.
//
const getStatus = async (req, res) =>{

  try {
    const { requestID } = req.params;

    // Verifica se o ID foi fornecido
    // Check if the ID was provided
    if (!requestID) {
      logger.error("Request ID is missing in the request.");
      return res.status(400).json({ message: "Request ID is required." });
    }

    // Obter o estado da conversão
    // Get the conversion status
    const status = downloadStatusMap.get(requestID);

    // Verifica se o status foi encontrado
    // Check if the status was found
    if (!status) {
      logger.error(`Request ID not found: ${requestID}`);
      return res.status(404).json({ message: "Request ID not found." });
    }

    // Retorna o status com sucesso
    // Return the status successfully
    logger.info(`Status retrieved successfully for Request ID: ${requestID}`);
    return res.status(200).json({ requestID, status });
    
  } catch (error) {
    logger.error("An error occurred while fetching the status.", error);
    return res.status(500).json({ message: "Internal Server Error." });
  };
};

module.exports = { getStatus };