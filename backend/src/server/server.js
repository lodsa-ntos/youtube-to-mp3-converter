// importar o módulo Express para criar o servidor
// import the Express library
const express = require('express');

// Instanciar todos os métodos e  propriedades do Express
// Instantiate all Express methods and properties
const app = express();

// Middleware para processar o corpo dos pedidos como JSON
// Middleware to process the body of requests as JSON
app.use(express.json());

// Importar as rotas do ficheiro 'convert-link-routes'
// Import the routes from the ‘convert-link-routes’ file
const convertRoutes = require('./routes/convert-link-router');

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Video Conversion API!');
});

// Define que as rotas da API começarão com '/api' para converter o vídeo
// Defines that API routes will start with ‘/api’ to convert the video
app.use('/api', convertRoutes);

// definir a Porta do servidor e tentar usar a PORTA definida na variável ambiente (process.env.PORT)
// mas, caso não esteja definida, é utilizada a porta padrão 3000

// set the server PORT and try to use the PORT defined in the environment variable (process.env.PORT)
// but if it is not set, the default port 3000 is used
const PORT = process.env.PORT || 3000;

// Iniciar o servidor e escutar a porta
// Start the server and listen to the port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Exportar a instância do Express (app) para ser utilizado em outros ficheiros
// Export the Express instance (app) to be used in other files
module.exports = app;

