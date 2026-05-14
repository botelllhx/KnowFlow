const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const workspaceAuth = require("../middlewares/workspaceAuth");
const workspaceController = require("../controllers/workspaceController");

router.use(auth);

router.get("/", workspaceController.listar);
router.post("/", workspaceController.criar);

router.get("/:id", workspaceAuth(), workspaceController.obter);
router.put("/:id", workspaceAuth("admin"), workspaceController.atualizar);
router.delete("/:id", workspaceAuth("admin"), workspaceController.deletar);

router.post("/:id/membros", workspaceAuth("admin"), workspaceController.adicionarMembro);
router.delete("/:id/membros/:userId", workspaceAuth("admin"), workspaceController.removerMembro);
router.put("/:id/membros/:userId", workspaceAuth("admin"), workspaceController.atualizarRole);

router.post("/:id/flows/:flowId", workspaceAuth(), workspaceController.adicionarFlow);
router.delete("/:id/flows/:flowId", workspaceAuth(), workspaceController.removerFlow);

module.exports = router;
