const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const logger =  require("../helpers/recordLogs" );
const { error } = require('console');

//
//* Função principal de conversão de vídeo
//* Main video conversion function
//
const convertVideoService = async (videoUrl, quality) => {

  try {
    // Verifica se a URL do vídeo foi fornecida
    // Check if the video URL was provided
    if (!videoUrl) throw new Error("Video URL is required.");

    // Verifica se a URL do vídeo é válida
    // Check if the video URL is valid
    if (!ytdl.validateURL(videoUrl)) throw new Error("Invalid video URL.");
    
    // Verifica se a qualidade do vídeo foi fornecida
    // Check if the video quality was provided
    if (!["64", "128", "192", "320"].includes(quality))
      throw new Error("Invalid quality. Choose: 64, 128, 192, 320.");

    // Obtém informações do vídeo
    // Get video information
    const videoInfo = await ytdl.getInfo(videoUrl);
    logger.info("Video Info retrieved successfully.");
    console.log('video Info: ', videoInfo);
    if (!videoInfo) throw new Error("Video not found.");

    const titleFile = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]/g, "");
    const fileName = `${titleFile}_${quality}.mp3`;
    const outputPath = path.join("public", "downloads", fileName);
    const outputDir = path.join("public", "downloads");

    // Verifica se o diretório existe, senão cria
    // Check if the directory exists, otherwise create it
    if (!fs.existsSync(outputDir)) {
      logger.info(`Creating directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Converte o vídeo para MP3
    // Convert the video to MP3
    const audioStream = ytdl(videoUrl, {
      filter: "audioonly",
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': 'https://www.youtube.com/',
          'Origin': 'https://www.youtube.com'
        }
      }
    });
    logger.info("Audio stream started for conversion.");
    await new Promise((resolve, reject) => {
      ffmpeg(audioStream)
        .audioBitrate(parseInt(quality))
        .save(outputPath)
        .on("end", () => {
          logger.info(`Conversion completed successfully. ${fileName}`);
          resolve();
        })
        .on("error", (error) => {
          logger.error("Error during conversion:", error);
          reject(error);
        });
    });

    // Retorna o resultado final
    // Return the final result
    logger.info(`File converted: ${fileName}`);
    return { 
      fileName, 
      downloadUrl: `/frontend/public/downloads/${fileName}` 
    };
  } catch (error) {
    logger.error("Error in convertVideoService:", error);
    throw new Error(error.message || "Unexpected error occurred during conversion.");
  }
};

module.exports = convertVideoService; 