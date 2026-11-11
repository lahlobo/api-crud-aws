
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    descricao: {
        type: String,
        default: ''
    },
    preco: {
        type: Number,
        required: true,
        min: 0
    },
    quantidade: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Produto', produtoSchema);
