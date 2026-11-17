
const express = require('express');
const mongoose = require('mongoose');
const Produto = require('../models/produto');
const autenticarToken = require('../middleware/auth');

const router = express.Router();

// Todas as rotas abaixo exigem autenticação
router.use(autenticarToken);

// LISTAR TODOS OS PRODUTOS
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao listar produtos.'
        });
    }
});

// BUSCAR UM PRODUTO PELO ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                mensagem: 'ID inválido.'
            });
        }

        const produto = await Produto.findById(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json(produto);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar produto.'
        });
    }
});

// CADASTRAR UM PRODUTO
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, preco, quantidade } = req.body;

        if (
            !nome ||
            preco === undefined ||
            quantidade === undefined ||
            preco === '' ||
            quantidade === ''
        ) {
            return res.status(400).json({
                mensagem: 'Preencha nome, preço e quantidade.'
            });
        }

        if (
            !Number.isFinite(Number(preco)) ||
            !Number.isFinite(Number(quantidade)) ||
            Number(preco) < 0 ||
            Number(quantidade) < 0
        ) {
            return res.status(400).json({
                mensagem: 'Preço e quantidade devem ser números não negativos.'
            });
        }

        const novoProduto = await Produto.create({
            nome,
            descricao,
            preco: Number(preco),
            quantidade: Number(quantidade)
        });

        res.status(201).json(novoProduto);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar produto.'
        });
    }
});

// ATUALIZAR UM PRODUTO
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                mensagem: 'ID inválido.'
            });
        }

        const camposPermitidos = [
            'nome',
            'descricao',
            'preco',
            'quantidade'
        ];

        const dadosAtualizados = {};

        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) {
                dadosAtualizados[campo] = req.body[campo];
            }
        }

        if (
            dadosAtualizados.preco !== undefined &&
            (!Number.isFinite(Number(dadosAtualizados.preco)) ||
             Number(dadosAtualizados.preco) < 0)
        ) {
            return res.status(400).json({
                mensagem: 'Preço deve ser um número não negativo.'
            });
        }

        if (
            dadosAtualizados.quantidade !== undefined &&
            (!Number.isFinite(Number(dadosAtualizados.quantidade)) ||
             Number(dadosAtualizados.quantidade) < 0)
        ) {
            return res.status(400).json({
                mensagem: 'Quantidade deve ser um número não negativo.'
            });
        }

        if (dadosAtualizados.preco !== undefined) {
            dadosAtualizados.preco = Number(dadosAtualizados.preco);
        }

        if (dadosAtualizados.quantidade !== undefined) {
            dadosAtualizados.quantidade = Number(dadosAtualizados.quantidade);
        }

        const produto = await Produto.findByIdAndUpdate(
            req.params.id,
            dadosAtualizados,
            { new: true, runValidators: true }
        );

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json({
            mensagem: 'Produto atualizado com sucesso!',
            produto
        });
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao atualizar produto.'
        });
    }
});

// EXCLUIR UM PRODUTO
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                mensagem: 'ID inválido.'
            });
        }

        const produto = await Produto.findByIdAndDelete(req.params.id);

        if (!produto) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado.'
            });
        }

        res.json({
            mensagem: 'Produto excluído com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir produto.'
        });
    }
});

module.exports = router;
