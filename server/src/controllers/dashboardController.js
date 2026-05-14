const { Flow, Usuario, Comentario, Curtida } = require("../models");
const { Op } = require("sequelize");

const dashboardController = {
  async obter(req, res) {
    try {
      const userId = req.usuarioId;

      // Dados do usuário
      const usuario = await Usuario.findByPk(userId, {
        attributes: ["id", "nome", "cargo", "empresa", "avatar_url", "criado_em"],
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      // Todos os flows do usuário
      const todosFlows = await Flow.findAll({
        where: { criado_por: userId },
        attributes: [
          "id", "titulo", "status", "categoria", "tags",
          "visualizacoes", "criado_em", "conteudo_nos",
        ],
        order: [["criado_em", "DESC"]],
      });

      const flowIds = todosFlows.map((f) => f.id);
      const flowsRecentes = todosFlows.slice(0, 5);
      const totalVisualizacoes = todosFlows.reduce(
        (sum, f) => sum + (f.visualizacoes || 0),
        0
      );

      let curtidasRecebidas = 0;
      let forksRecebidos = 0;
      let atividadeRecente = [];

      if (flowIds.length > 0) {
        const [curtidas, forks, comentariosRecentes, forksRecentes] =
          await Promise.all([
            // Curtidas recebidas nos flows do usuário
            Curtida
              ? Curtida.count({ where: { flow_id: { [Op.in]: flowIds } } })
              : Promise.resolve(0),

            // Forks dos flows do usuário
            Flow.count({ where: { fork_de: { [Op.in]: flowIds } } }),

            // Comentários recentes nos flows do usuário
            Comentario.findAll({
              where: { flow_id: { [Op.in]: flowIds } },
              include: [{ model: Usuario, attributes: ["nome", "cargo"] }],
              order: [["criado_em", "DESC"]],
              limit: 6,
              attributes: ["id", "mensagem", "flow_id", "criado_em"],
            }),

            // Forks recentes dos flows do usuário
            Flow.findAll({
              where: { fork_de: { [Op.in]: flowIds } },
              include: [
                { model: Usuario, attributes: ["nome", "cargo"] },
              ],
              order: [["criado_em", "DESC"]],
              limit: 6,
              attributes: ["id", "fork_de", "criado_em", "criado_por"],
            }),
          ]);

        curtidasRecebidas = curtidas;
        forksRecebidos = forks;

        const comentariosFormatados = comentariosRecentes.map((c) => ({
          tipo: "comentario",
          usuario_nome: c.Usuario?.nome || "Alguém",
          usuario_cargo: c.Usuario?.cargo || null,
          flow_id: c.flow_id,
          flow_titulo:
            todosFlows.find((f) => f.id === c.flow_id)?.titulo || "Flow",
          mensagem:
            c.mensagem && c.mensagem.length > 80
              ? c.mensagem.slice(0, 80) + "..."
              : c.mensagem || "",
          criado_em: c.criado_em,
        }));

        const forksFormatados = forksRecentes.map((f) => ({
          tipo: "fork",
          usuario_nome: f.Usuario?.nome || "Alguém",
          usuario_cargo: f.Usuario?.cargo || null,
          flow_id: f.fork_de,
          flow_titulo:
            todosFlows.find((tf) => tf.id === f.fork_de)?.titulo || "Flow",
          criado_em: f.criado_em,
        }));

        atividadeRecente = [...comentariosFormatados, ...forksFormatados]
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
          .slice(0, 8);
      }

      return res.json({
        usuario: usuario.toJSON(),
        stats: {
          flows_criados: todosFlows.length,
          visualizacoes_totais: totalVisualizacoes,
          curtidas_recebidas: curtidasRecebidas,
          forks_recebidos: forksRecebidos,
        },
        flows_recentes: flowsRecentes,
        atividade_recente: atividadeRecente,
      });
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao carregar dashboard",
        detalhes: error.message,
      });
    }
  },
};

module.exports = dashboardController;
