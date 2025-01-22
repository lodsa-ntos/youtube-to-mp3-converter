const s3 = require('./s3Config');
const fs = require('fs');
const logger = require('../helpers/recordLogs')

// Função para carregar ficheiros no s3
// Function to upload file to s3
const uploadToS3 = async (filePath, bucketName, key) => {

  try {
    
    // Ler o ficheiro
    // Read file
    const fileStream = fs.createReadStream(filePath);

    // Definir os parametros
    // Set params
    const params = {
      Bucket: bucketName,
      key: key,
      Body: fileStream,
    };

    // Upload do ficheiro
    // Upload file
    const data = await s3.upload(params).promise();
    logger.info('File uploaded successfully: ', data.Location);
    console.log('File uploaded successfully: ', data.Location);
  
  } catch (error) {
    logger.error('Error uploading file to s3: ', error);
    console.error('Error uploading file to s3: ', error);
    throw error;
  }
};

module.exports = uploadToS3;