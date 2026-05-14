const redis = require("../../redis");

const cache = (ttlSeconds) => async (req, res, next) => {
  // Se Redis não está conectado, pula o cache
  if (redis.status !== "ready") return next();

  const key = `cache:${req.originalUrl}`;
  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Intercepta res.json para salvar no cache
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        redis.setex(key, ttlSeconds, JSON.stringify(data)).catch(() => {});
      }
      return originalJson(data);
    };

    next();
  } catch (err) {
    // Se Redis falhar, continua sem cache
    next();
  }
};

module.exports = cache;
