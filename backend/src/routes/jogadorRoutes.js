const { Router } = require('express');
const JogadorController = require('../controllers/JogadorController');

const router = Router();
const controller = new JogadorController();

router.get('/jogadores', controller.listar);
router.get('/jogadores/:id', controller.obterPorId);
router.post('/jogadores', controller.criar);
router.delete('/jogadores/:id', controller.deletar);

module.exports = router;