const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: (times) => {
    if (times > 3) return null; // desiste após 3 tentativas
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () => console.log("Redis conectado."));
redis.on("error", (err) => console.warn("Redis indisponível:", err.message));

module.exports = redis;
