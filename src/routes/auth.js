
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const router = express.Router();

// Cadastro de usuário
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                mensagem: 'Preencha todos os campos.'
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                mensagem: 'A senha deve ter pelo menos 8 caracteres.'
            });
        }

        const usuarioExiste = await Usuario.findOne({ email });

        if (usuarioExiste) {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: senhaHash
        });

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: novoUsuario._id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.',
            erro: erro.message
        });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: 'Informe e-mail e senha.'
            });
        }

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const token = jwt.sign(
            {
                id: usuario._id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            mensagem: 'Login realizado com sucesso!',
            token
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao realizar login.',
            erro: erro.message
        });
    }
});

module.exports = router;
