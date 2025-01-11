//
// Importar o módulo Express para gerir as rotas
// Import the Express library to manage routes
//
const express = require('express');

//
// Importar o controlador de vídeo do controlador
// Import the video driver from the controller
//
const { convertVideo } = require('../controllers/video-converter-controller');
const { error } = require('winston');

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

  //
  // Valida se o URL e a qualidade foram fornecidos
  // Validates that the URL and quality have been supplied
  //
  if (!url) {
    return res.status(400).send({ error: 'URL is required.' });
  }
  if (!quality || !['64', '128', '192', '320'].includes(quality)) {
    return res.status(400).send({ error: 'Invalid quality. Choose from: 64, 128, 192, 320.' });
  }

  try {
    //
    // Chama a função de conversão no controlador e passa URL e qualidade como parâmetros
    // Calls the conversion function in the controller and passes URL and quality as parameters
    //
    const filePath = await convertVideo(url, quality);

    res.download(filePath, 'audio.mp3', () => {
      console.log('File sent successfully.');
    });
  } catch (error) {
    console.error('Conversion error: ', error);
    return res.status(500).send({ error: 'Error during video conversion.'});
  }
});

//
// Exportar o router para ser utilizado em outros ficheiros
// Export the router to be used in other files
//
module.exports = router;
