const express = require("express");
const router = express.Router();
const pulseController = require("../controllers/pulseController");
const auth = require("../middlewares/auth");
const cache = require("../middlewares/cache");

router.get("/", auth, cache(3600), pulseController.obter);

module.exports = router;
