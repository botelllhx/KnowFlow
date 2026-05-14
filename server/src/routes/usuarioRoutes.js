const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

// Rotas públicas
router.post('/cadastro', usuarioController.cadastrar);
router.post('/login', usuarioController.login);

// Rota protegida (exemplo de uso do middleware)
router.get('/', auth, usuarioController.listarTodos);
router.get('/me', auth, usuarioController.obterUsuarioLogado);
router.put('/me', auth, usuarioController.atualizar);

module.exports = router;
