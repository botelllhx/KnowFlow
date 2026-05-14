const express = require("express");
const router = express.Router();
const execucaoController = require("../controllers/execucaoController");
const auth = require("../middlewares/auth");

router.post("/", auth, execucaoController.criar);
router.get("/", auth, execucaoController.listar);
router.get("/:id", auth, execucaoController.obter);
router.patch("/:id/etapas/:noId", auth, execucaoController.atualizarEtapa);
router.patch("/:id/concluir", auth, execucaoController.concluir);
router.patch("/:id/cancelar", auth, execucaoController.cancelar);

module.exports = router;
