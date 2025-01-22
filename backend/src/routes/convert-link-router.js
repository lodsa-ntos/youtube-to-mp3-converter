//
// Importar o módulo Express para gerir as rotas
// Import the Express library to manage routes
//
const express = require('express');

//
// Importar o controlador de vídeo do controlador
// Import the video driver from the controller
//
const { convertVideo, getStatus } = require('../services/converter-video');
const { error, log } = require('winston');
const logger = require('../helpers/record-logs');

//
// Criar uma instância do router Express para definir rotas
// Create an Express router instance to define routes
//
const router = express.Router();

//
// Rota para converter vídeos: aceita pedidos POST com URL e qualidade como parâmetros
// Route to convert videos: accepts POST requests with URL and quality as parameters
//
router.post('/convert', async (req, res) => {
  const { url, quality } = req.body;

  logger.info(`Request to convert video: ${url} with quality: ${quality}`);
  //
  // Valida se o URL e a qualidade foram fornecidos
  // Validates that the URL and quality have been supplied
  //
  if (!url) {
    logger.error('URL is required.');
    return res.status(400).send({ error: 'URL is required.' });
  }
  if (!quality || !['64', '128', '192', '320'].includes(quality)) {
    logger.error('Invalid quality. Choose from: 64, 128, 192, 320.');
    return res.status(400).send({ error: 'Invalid quality. Choose from: 64, 128, 192, 320.' });
  }

  try {
    
    logger.info('Starting video conversion...');
    const requestID = await convertVideo(url, quality);

    res.status(200).send({ 
      requestID,
      message: 'Conversion started. You can check the status using the requestId.',    
    });

  } catch (error) {
    logger.error('Conversion error: ', error);
    console.error('Conversion error: ', error);
    return res.status(500).send({ error: 'Error during video conversion.'});
  }
});

router.get('/status/:requestID', async (req, res) => {
  const { requestID } = req.params;

  logger.info(`Checking status for request ID: ${requestID}`);

  if (!requestID) {
    logger.error('Request ID is required.');
    return res.status(400).send({ error: 'Request ID is required.' });
  }

  try {
    const status = await getStatus(requestID);
    logger.info('Status check complete.');

    if (!status) {
      logger.error('Request not found.');
      return res.status(404).send({ error: 'Request not found.' });
    }
    res.status(200).send(status);

  } catch (error) {
    logger.error('Status check error: ', error);
    console.error('Status check  error: ', error);
    return res.status(500).send({ error: 'Error retrieving status.'});
  }
});

//
// Exportar o router para ser utilizado em outros ficheiros
// Export the router to be used in other files
//
module.exports = router;
