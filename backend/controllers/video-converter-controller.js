const express = require('express');
const app = express();

//
// Importações e configurações.
// Imports and configurations.
//
const ytdl =  require('ytdl-core');
const path = require('path');
const fs = require('fs');
const { error } = require('console');
const logger = require('../utils/record-logs');

//
// Middleware global para captura de erros.
// Global middleware for error capture.
//
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error. ', error: err.message });
});

//
// Estado do download
// Download status
//
let downloadStatus = {
    inProgress: false,
    message: '',
}

//
// Funções para validar o URL 
// Fnctions to validate the URL
//
function validateUrl (videoUrl) {
   return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(videoUrl);
}

//
// Função para eliminar ficheiros temporários
// Function to delete temporary files
//
const removeTempFile = (fileName) => {
    const filePath = path.join('public', 'downloads', fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            onsole.error('Error deleting file: ', err);
        } else {
            console.log('File deleted: ', fileName);
        }
    });
};

//
//* Função principal de conversão de vídeo
//* Main video conversion function
//
async function convertVideo(req, res) {
    
    const { videoUrl } = req.body;

    logger.info(`Request received to convert video: ${videoUrl}`);

    //
    // Validar o URL e a disponibilidade do vídeo.
    // Validate the URL and the availability of the video.
    //
    if (!videoUrl || !validateUrl(videoUrl)) {
        logger.warn(`Invalid or missing video URL: ${videoUrl}`);
        return res.status(400).json({ message: 'Invalid or missing video URL'});
    }

    try {

        downloadStatus.inProgress = true;
        downloadStatus.message = 'Conversion in progress...';
        logger.info('Video conversion started.');

        const videoInfo = await ytdl.getInfo(videoUrl);
        const fileName = `${videoInfo.videoDetails.title}.mp3`;
        const outputPath = path.join('public', 'downloads', fileName);

        const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
        const writeStream = fs.createWriteStream(outputPath);

        audioStream.pipe(writeStream); // Conecta os dois fluxos (audioStream and writeStream) | Connects the two flows

        //
        // Se algo falhar no processo de conversão, a variável inProgress é atualizada para refletir o estado final e mostrar uma mensagem de erro sobre o estado do download
        // If something fails in the conversion process, the download status is changed and an error message about the download status is displayed.
        //
        writeStream.on('error', () => {
            downloadStatus.inProgress = false;
            downloadStatus.message = 'Error during conversion';
        });

        //
        // No fim da conversão, chamamos a função para limpar o ficheiro
        // At the end of the conversion, we call the function to clear the file
        //
        writeStream.on('finish', () => {
            downloadStatus.inProgress = false;
            downloadStatus.message = 'Conversion successful';
            
            //
            // Limpeza do ficheiro após 5 segundos
            // Cleaning the file after 5 seconds
            //
            setTimeout(() => {
                removeTempFile(fileName);
            }, 5000);
        });

        logger.info(`Video successfully converted: ${fileName}`);
        return res.status(200).json({
            message: 'Conversion completed',
            downloadUrl:`/frontend/public/downloads/${fileName}`
        });

    } catch (error) {

        console.error('Error in conversion: ', error);

        if (error instanceof ytdl.errors.VideoUnavailable) {
            //
            // Caso o vídeo não esteja disponível.
            // If the video is not available.
            //
            return res.status(400).json({ message: 'Video is not unavailable.'})
        } else if (error.message.includes('Invalid URL')) {
            //
            // Caso a URL seja inválida
            // If the URL is invalid
            //
            return res.status(400).json({ message: 'Invalid URL provided. '});
        } else if (error.message.includes('network error')) {
            //
            // Caso ocorra falha de conexão com a internet
            // In the event of an internet connection failure
            //
            return res.status(500).json({ message: 'Connection failed. Try again.'})
        } else if (fs.existsSync(outputPath)) {
            //
            // Caso o ficheiro já exista no sistema
            // If the file already exists in the system
            //
            return res.status(500).json({ message: 'The file has already been converted.' })
        } else {
            //
            // Para todos os outros erros não tratados
            // For all other untreated errors
            //
            logger.error(`Error during video conversion: ${error.message}`);
            return res.status(500).json({ message: 'An unexpected error occurred during the conversion ', error});
        }
    } finally {
        downloadStatus.inProgress = false;
    }
}

//
// Endpoint GET /status
// Retorna o status atual da conversão, seja em andamento ou finalizado.
// Returns the current status of the conversion, either in progress or finalised.
//
app.get('/status', (req, res) => { 
    res.status(200).json({
        inProgress: downloadStatus.inProgress,
        message: downloadStatus.message,
    });    
});

module.exports = { convertVideo };
