require("dotenv").config();
const express = require("express");
const { sequelize } = require("./src/models");
require("./redis"); // inicializa conexão Redis
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const usuarioRoutes = require("./src/routes/usuarioRoutes");
const flowRoutes = require("./src/routes/flowRoutes");
const comentarioRoutes = require("./src/routes/comentarioRoutes");
const flowSalvoRoutes = require("./src/routes/flowsalvoRouter");
const curtidaRoutes = require("./src/routes/curtidaRouter");
const comentarioPostagemRoutes = require("./src/routes/comentarioPostagemRoutes");
const postagemComunidadeRoutes = require("./src/routes/postagemComunidadeRoutes");
const filters = require("./src/routes/filtrosRouter");
const pulseRoutes = require("./src/routes/pulseRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const workspaceRoutes = require("./src/routes/workspaceRoutes");
const execucaoRoutes = require("./src/routes/execucaoRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const buscaRoutes = require("./src/routes/buscaRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");

const app = express();

// Segurança
app.use(helmet());

// CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:3005"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas requisições. Tente novamente em 15 minutos." },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rotas da API
app.use("/api/usuario", usuarioRoutes);
app.use("/api/flow", flowRoutes);
app.use("/api/comentario", comentarioRoutes);
app.use("/api/flowsalvos", flowSalvoRoutes);
app.use("/api/curtidas", curtidaRoutes);
app.use("/api/comentariopostagem", comentarioPostagemRoutes);
app.use("/api/postagemcomunidade", postagemComunidadeRoutes);
app.use("/api/filtros", filters);
app.use("/api/pulse", pulseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/execucao", execucaoRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/busca", buscaRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "API do KnowFlow está rodando!", versao: "2.0.0" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  const status = err.status || 500;
  const mensagem =
    process.env.NODE_ENV === "production"
      ? "Erro interno do servidor"
      : err.message;
  res.status(status).json({ erro: mensagem });
});

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com banco estabelecida.");
    app.listen(PORT, () => {
      console.log(`Servidor KnowFlow rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco:", err);
    process.exit(1);
  });
