const redis = require("../../redis");

// Invalida todas as chaves que começam com o padrão
const invalidateCache = (pattern) => async (req, res, next) => {
  if (redis.status !== "ready") return next();
  try {
    const keys = await redis.keys(`cache:${pattern}*`);
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    // falha silenciosa
  }
  next();
};

module.exports = invalidateCache;
