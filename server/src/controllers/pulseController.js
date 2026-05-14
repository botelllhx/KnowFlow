const { Flow, Usuario, Comentario } = require("../models");
const { Op, fn, col } = require("sequelize");

const pulseController = {
  async obter(req, res) {
    try {
      const agora = new Date();
      const seteDiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
      const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
      const noventaDiasAtras = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);

      const [
        flowsEmAlta,
        totalPublicados,
        novos7dias,
        novos30dias,
        totalForks,
        categoriasRaw,
        flowsEmRisco,
        forksAgrupados,
        flowsParaGargalos,
      ] = await Promise.all([
        // Flows mais visualizados
        Flow.findAll({
          where: { status: "publicado" },
          include: [{ model: Usuario, attributes: ["nome"] }],
          order: [["visualizacoes", "DESC"]],
          limit: 5,
          attributes: ["id", "titulo", "categoria", "visualizacoes"],
        }),

        // Contagens de crescimento
        Flow.count({ where: { status: "publicado" } }),
        Flow.count({
          where: { status: "publicado", criado_em: { [Op.gte]: seteDiasAtras } },
        }),
        Flow.count({
          where: { status: "publicado", criado_em: { [Op.gte]: trintaDiasAtras } },
        }),

        // Total de forks
        Flow.count({ where: { fork_de: { [Op.ne]: null } } }),

        // Categorias ativas (agrupadas)
        Flow.findAll({
          where: { status: "publicado", categoria: { [Op.ne]: null } },
          attributes: ["categoria", [fn("COUNT", col("flow.id")), "total"]],
          group: ["categoria"],
          order: [[fn("COUNT", col("flow.id")), "DESC"]],
          limit: 6,
          raw: true,
        }),

        // Flows em risco (criados há mais de 90 dias, sem atualização)
        Flow.findAll({
          where: {
            status: "publicado",
            criado_em: { [Op.lt]: noventaDiasAtras },
          },
          include: [{ model: Usuario, attributes: ["nome"] }],
          order: [["criado_em", "ASC"]],
          limit: 5,
          attributes: ["id", "titulo", "categoria", "criado_em", "visualizacoes"],
        }),

        // Forks agrupados por flow original
        Flow.findAll({
          where: { fork_de: { [Op.ne]: null } },
          attributes: ["fork_de", [fn("COUNT", col("id")), "total_forks"]],
          group: ["fork_de"],
          order: [[fn("COUNT", col("id")), "DESC"]],
          limit: 5,
          raw: true,
        }),

        // Flows com comentários (para identificar gargalos)
        Flow.findAll({
          where: { status: "publicado" },
          include: [
            { model: Comentario, attributes: ["id"] },
            { model: Usuario, attributes: ["nome"] },
          ],
          attributes: ["id", "titulo", "categoria"],
        }),
      ]);

      // Processar gargalos: flows com mais comentários
      const gargalos = flowsParaGargalos
        .map((f) => ({
          id: f.id,
          titulo: f.titulo,
          categoria: f.categoria,
          autor_nome: f.Usuario?.nome || null,
          total_comentarios: (f.Comentarios || f.comentarios || []).length,
        }))
        .filter((f) => f.total_comentarios > 0)
        .sort((a, b) => b.total_comentarios - a.total_comentarios)
        .slice(0, 5);

      // Processar flows mais derivados
      let maisDerivados = [];
      if (forksAgrupados.length > 0) {
        const ids = forksAgrupados.map((f) => f.fork_de);
        const originals = await Flow.findAll({
          where: { id: { [Op.in]: ids } },
          include: [{ model: Usuario, attributes: ["nome"] }],
          attributes: ["id", "titulo", "categoria"],
        });
        maisDerivados = forksAgrupados.map((fork) => {
          const original = originals.find((o) => o.id === fork.fork_de);
          return {
            id: fork.fork_de,
            titulo: original?.titulo || "Flow removido",
            categoria: original?.categoria || null,
            autor_nome: original?.Usuario?.nome || null,
            total_forks: parseInt(fork.total_forks, 10),
          };
        });
      }

      return res.json({
        crescimento: {
          total_publicados: totalPublicados,
          ultimos_7_dias: novos7dias,
          ultimos_30_dias: novos30dias,
          total_forks: totalForks,
          taxa_reutilizacao:
            totalPublicados > 0
              ? Math.round((totalForks / totalPublicados) * 100)
              : 0,
        },
        flows_em_alta: flowsEmAlta,
        categorias_ativas: categoriasRaw,
        gargalos,
        flows_em_risco: flowsEmRisco,
        reutilizacao: {
          total_forks: totalForks,
          mais_derivados: maisDerivados,
        },
      });
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao buscar dados do Pulse",
        detalhes: error.message,
      });
    }
  },
};

module.exports = pulseController;
