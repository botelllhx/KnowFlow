const express = require('express');
const router = express.Router();
const flowController = require('../controllers/flowController');
const auth = require('../middlewares/auth');
const cache = require('../middlewares/cache');
const invalidateCache = require('../middlewares/invalidateCache');

router.get('/', cache(300), flowController.listar);
router.get('/:id', flowController.obter);

router.post('/', auth, invalidateCache('/api/flow'), flowController.criar);
router.post('/:id/fork', auth, flowController.fork);
router.put('/:id', auth, invalidateCache('/api/flow'), flowController.atualizar);
router.delete('/:id', auth, invalidateCache('/api/flow'), flowController.deletar);

const buscaController = require("../controllers/buscaController");
router.get("/:id/relacionados", buscaController.relacionados);
router.get("/:id/contexto-ia", buscaController.contextoIA);

module.exports = router;
