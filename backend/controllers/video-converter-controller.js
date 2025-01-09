// Importar a biblioteca ytdl-core para interagir facilmente com vídeos do YouTube
// Import the ytdl-core library to easily interact with YouTube videos
const ytdl =  require('ytdl-core');

//
// Importar o módulo 'path' para manipulação de caminhos para os ficheiros
// Import the ‘path’ module for manipulating file paths
//
const path = require('path');

//
// Importar o módulo 'fs' para leitura e escrita nos ficheiros
// Import the 'fs' module for file reading and writing
//
const fs = require('fs');
const { error } = require('console');

//
// Middleware global para capturar erros que possam escapam do fluxo esperado.
// Global middleware to capture errors that may escape the expected flow.
//
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error. ', error: err.message })
})

let downloadStatus = {
    inProgress: false,
    message: '',
}

//
// Funções Auxiliar para validar o URL e a disponibilidade do vídeo.
// Auxiliary functions to validate the URL and the availability of the video.
//
function validateUrl (videoUrl) {
   return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(videoUrl);
}

//
// Função assíncrona 'convertVideo' que processa a conversão do vídeo
// Recebe dois parâmetros: req (pedido) e res (resposta) para gerir a solicitação HTTP.
// Asynchronous function ‘convertVideo’ that processes the video conversion
//
async function convertVideo(req, res) {
    
    const { videoUrl } = req.body;

    //
    // Validar o URL e a disponibilidade do vídeo.
    // Validate the URL and the availability of the video.
    //
    if (!videoUrl || !validateUrl(videoUrl)) {
        return res.status(400).json({ message: 'Invalid or missing video URL'});
    }

    downloadStatus.inProgress = true;
    downloadStatus.message = 'Conversion in progress...';

    try {
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
        // Função para eliminar o ficheiro temporário após a conversão
        // Function to delete the temporary file after conversion
        //
        const removeTempFile = (fileName) => {
            const filePath = path.join('public', 'downloads', fileName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file: ', err);
                } else {
                    console.log('File deleted: ', fileName);
                }
            });
        };

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

        //
        // Endpoint GET /status
        // Retorna o status atual da conversão, seja ele em andamento ou finalizado.
        // Returns the current status of the conversion, either in progress or finalised.
        //
        app.get('/status', (req, res) => { 
            res.status(200).json({
                inProgress: downloadStatus.inProgress,
                message: downloadStatus.message,
            });
            
        })

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
            return res.status(500).json({
                message: 'An unexpected error occurred during the conversion.',
                error: error.message
            });
        }
    }
}

module.exports = { convertVideo };
