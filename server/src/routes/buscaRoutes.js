const express = require("express");
const router = express.Router();
const buscaController = require("../controllers/buscaController");

router.get("/", buscaController.buscar);

module.exports = router;
