const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middlewares/auth");
const uploadController = require("../controllers/uploadController");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

router.post("/", auth, upload.single("file"), uploadController.uploadMidia);

module.exports = router;
