
// Carrega as variáveis do arquivo .env
require('dotenv').config();

// Importa o Express
const express = require('express');
const authRoutes = require('./src/routes/auth');

// Importa a função de conexão com o banco
const conectarBanco = require('./src/config/database');
const produtoRoutes = require('./src/routes/produtos');

// Cria a aplicação
const app = express();

// Permite receber dados em formato JSON
app.use(express.json());
app.use('/api/produtos', produtoRoutes);
app.use('/api/auth', authRoutes);

// Conecta ao MongoDB e inicia o servidor
const iniciarServidor = async () => {
    try {
        await conectarBanco();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    } catch (erro) {
        console.error('Erro ao iniciar a aplicação:', erro.message);
        process.exit(1);
    }
};

iniciarServidor();
