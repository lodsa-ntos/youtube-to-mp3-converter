const convertVideo = require('../services/convertVideo'); 
const logger = require("../helpers/recordLogs");

// Função para converter vídeo a partir de um determinado URL
// Function to convert video from a given URL
const convertLink = async (req, res) => {

  const { videoUrl, quality } = req.body;

  if (!videoUrl) {
    const errorMessage = "Video URL is required.";
    logger.error(errorMessage);
    return res.status(400).json({ message: errorMessage });
  }

  try {
    
    console.log("Request Body Received: ", req.body);
    // A função convertVideo irá retornar o ficheiro convertido e a URL para download
    // The convertVideo function will return the converted file and the download URL
    const { fileName, downloadUrl } = await convertVideo(videoUrl, quality);
  
    logger.info(`Conversion successful for video: ${fileName}`);
    res.status(200).json({
      message: "Conversion completed successfully.",
      downloadUrl,
    });

  } catch (error) {
    logger.error('Error in video conversion:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { convertLink };