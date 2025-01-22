const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const logger =  require("../helpers/recordLogs" );

//
//* Função principal de conversão de vídeo
//* Main video conversion function
//
const convertVideo = async (videoUrl, quality) => {

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
  if (!videoInfo) throw new Error("Video not found.");

  const titleFile = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]/g, "");
  const fileName = `${titleFile}_${quality}.mp3`;
  const outputPath = path.join("public", "downloads", fileName);
  const outputDir = path.join("public", "downloads");

  // Verifica se o arquivo já existe
  // Check if the file already exists
  if (!fs.existsSync(outputDir)) {
    logger.info(`Criando diretório: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Converte o vídeo para MP3
  // Convert the video to MP3
  const audioStream = ytdl(videoUrl, { filter: "audioonly" });
  await new Promise((resolve, reject) => {
    ffmpeg(audioStream)
      .audioBitrate(parseInt(quality))
      .save(outputPath)
      .on("end", resolve)
      .on("error", reject);
  });

  // Registra o download do arquivo
  // Register the file download
  logger.info(`Arquivo convertido: ${fileName}`);
  return { 
    fileName, 
    downloadUrl: `/frontend/public/downloads/${fileName}` 
  };
};

module.exports = convertVideo; 