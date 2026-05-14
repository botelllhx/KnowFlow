const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadMidia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: "Nenhum arquivo enviado." });
    }

    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
    ];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(415).json({ erro: "Tipo de arquivo não suportado." });
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (req.file.size > maxSize) {
      return res.status(413).json({ erro: "Arquivo muito grande. Máximo: 20MB." });
    }

    const isAudio = req.file.mimetype.startsWith("audio/");
    const folder = isAudio ? "knowflow/audio" : "knowflow/images";
    const resourceType = isAudio ? "video" : "image"; // cloudinary usa "video" para áudio

    const b64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: resourceType,
    });

    return res.status(201).json({
      url: result.secure_url,
      public_id: result.public_id,
      formato: result.format,
      tamanho: result.bytes,
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro ao fazer upload da mídia." });
  }
};
