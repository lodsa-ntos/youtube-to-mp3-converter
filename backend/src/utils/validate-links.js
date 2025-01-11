//
// Funções para validar o URL 
// Fnctions to validate the URL
//
function validateUrl (videoUrl) {
  return /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(videoUrl);
}

module.exports = { validateUrl };