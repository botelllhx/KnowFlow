const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middlewares/auth");

// auth opcional para registrar evento
router.post("/evento", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const jwt = require("jsonwebtoken");
      req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_) {}
  }
  next();
}, analyticsController.registrarEvento);

router.get("/usuario", auth, analyticsController.getAnalyticsUsuario);
router.get("/flow/:flowId", auth, analyticsController.getAnalyticsFlow);

module.exports = router;
