const express = require("express");
const app = express();

//
// Importações e configurações.
// Imports and configurations.
//
const ytdl = require("ytdl-core");
const path = require("path");
const fs = require("fs");
const { error } = require("console");
const logger = require("../helpers/record-logs");
const ffmpeg = require("fluent-ffmpeg");
const validateUrl = require("../middlewares/validate-links").default;
const { v4: uuidv4 } = require("uuid");

//
// Middleware global para captura de erros.
// Global middleware for error capture.
//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error. ", error: err.message });
});

//
// Estado do download
// Download status
//
let downloadStatus = {
  inProgress: false,
  message: "",
};

//
// Mapa de estado do download
// Download status map
//
let downloadStatusMap = new Map();

//
// Middleware para análise de JSON
// Middleware for analysing JSON
//
app.use(express.json());

//
// Função para eliminar ficheiros temporários
// Function to delete temporary files
//
const removeTempFile = (fileName) => {
  const filePath = path.join("public", "downloads", fileName);
  fs.unlink(filePath, (err) => {
    if (err) {
      onsole.error("Error deleting file: ", err);
    } else {
      console.log("File deleted: ", fileName);
    }
  });
};

//
//* Função principal de conversão de vídeo
//* Main video conversion function
//
const convertVideo = async (req, res) => {
  //
  // Gera um ID único para cada pedido
  // Generates a unique ID for each request
  //
  const requestID = uuidv4();
  const { videoUrl, quality } = req.body;

  logger.info(`Request received to convert video: ${videoUrl}`);

  //
  // Adicionar o ID do pedido ao mapa de estado do download
  // Add the request ID to the download status map
  //
  downloadStatusMap.set(requestID, {
    inProgress: true,
    message: "Conversion in progress...",
  });

  //
  // Validar o URL e a disponibilidade do vídeo e a qualidade do mesmo.
  // Validate the URL and the availability of the video and its quality.
  //
  if (!videoUrl || !validateUrl(videoUrl)) {
    logger.warn(`Invalid or missing video URL: ${videoUrl}`);
    return res.status(400).json({ message: 'Invalid or missing video URL'});
  }

  if (!quality || !["64", "128", "192", "320"].includes(quality)) {
    logger.warn(`Missing Choose quality: ${quality}`);
    return res
      .status(400)
      .json({ error: "Invalid quality. Choose: 64, 128, 192, 320." });
  }

  try {
    logger.info(`Fetching video info for URL: ${videoUrl}`);
    const videoInfo = await ytdl.getInfo(videoUrl);
    const titleFile = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]/g, ""); // Remove invalid characters
    const fileName = `${titleFile}_${quality}kbps.mp3`;
    const outputPath = path.join("public", "downloads", fileName);
    const outputDir = path.join("public", "downloads");

    // Ensure that the public/downloads directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // error for ‘not found’ video
    if (!videoInfo) {
      return res.status(404).json({ message: "Video not found." });
    }

    downloadStatus.inProgress = true;
    downloadStatus.message = "Conversion in progress...";
    logger.info("Video conversion started.");
    console.log("Request ID:", requestID);
    console.log("Video URL:", videoUrl);
    console.log("Quality:", quality);

    const audioStream = ytdl(videoUrl, { filter: "audioonly" });
    await new Promise((resolve, reject) => {
      ffmpeg(audioStream)
        .audioBitrate(parseInt(quality))
        .save(outputPath)
        .on("end", resolve)
        .on("error", reject);
    });

    downloadStatus.inProgress = false;
    downloadStatus.message = "Conversion successful";

    //
    // Limpar o ficheiro após 5 segundos
    // Clean the file after 5 seconds
    //
    setTimeout(() => {
      downloadStatusMap.set(requestID, {
        inProgress: false,
        message: "Conversion completed",
        downloadUrl: `/downloads/${fileName}`,
      });
    }, 5000);

    logger.info(`Video successfully converted: ${fileName}`);
    return res
      .status(200)
      .json({
        message: "Conversion completed",
        downloadUrl: `/downloads/${fileName}`,
      });
  } catch (error) {
    logger.error(`Error during video conversion: ${error.message}`);
    downloadStatus.inProgress = false;

    if (error instanceof ytdl.errors.VideoUnavailable) {
      //
      // Caso o vídeo não esteja disponível.
      // If the video is not available.
      //
      logger.error("Video is not available.");
      return res.status(404).json({ message: "Video is not unavailable." });
    } else if (error.message.includes("Invalid URL")) {
      //
      // Caso a URL seja inválida
      // If the URL is invalid
      //
      logger.error("Invalid URL provided. ");
      return res.status(400).json({ message: "Invalid URL provided. " });
    } else if (error.message.includes("network error")) {
      //
      // Caso ocorra falha de conexão com a internet
      // In the event of an internet connection failure
      //
      logger.error("Connection failed. Try again.");
      return res.status(500).json({ message: "Connection failed. Try again." });
    } else if (fs.existsSync(outputPath)) {
      //
      // Caso o ficheiro já exista no sistema
      // If the file already exists in the system
      //
      logger.warn(`File already exists: ${fileName}`);
      return res
        .status(500)
        .json({ message: "The file has already been converted." });
    } else {
      //
      // Para todos os outros erros não tratados
      // For all other untreated errors
      //
      logger.error(`Error during video conversion: ${error.message}`);
      return res
        .status(500)
        .json({
          message: "An unexpected error occurred during the conversion ",
          error,
        });
    }
  }
}

module.exports = convertVideo;
