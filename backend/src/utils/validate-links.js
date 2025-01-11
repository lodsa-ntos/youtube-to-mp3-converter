//
// Função para validar o URL 
// Fnction to validate the URL
//
function validateUrl (videoUrl) {
  return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(videoUrl);
}

module.exports = { validateUrl };