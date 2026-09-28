const { Router } = require('express');
const SequenciaTreinoController = require('../controllers/SequenciaTreinoController');

const router = Router();
const controller = new SequenciaTreinoController();

router.get('/sequencias-treino', controller.listar);
router.get('/sequencias-treino/:id', controller.obterPorId);
router.post('/sequencias-treino', controller.criar);
router.delete('/sequencias-treino/:id', controller.deletar);

module.exports = router;