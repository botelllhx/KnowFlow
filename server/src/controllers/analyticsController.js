const { Op } = require("sequelize");
const { sequelize, ViewEvento, Flow, Execucao } = require("../models");

exports.registrarEvento = async (req, res) => {
  try {
    const { flow_id, no_id } = req.body;
    if (!flow_id) return res.status(400).json({ erro: "flow_id obrigatório." });
    const usuario_id = req.usuario?.id || null;
    await ViewEvento.create({ flow_id, no_id: no_id || null, usuario_id });
    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.getAnalyticsFlow = async (req, res) => {
  try {
    const { flowId } = req.params;

    const total_views = await ViewEvento.count({
      where: { flow_id: flowId, no_id: null },
    });

    const nodeViewsRaw = await ViewEvento.findAll({
      attributes: [
        "no_id",
        [sequelize.fn("COUNT", sequelize.col("no_id")), "count"],
      ],
      where: {
        flow_id: flowId,
        no_id: { [Op.not]: null },
      },
      group: ["no_id"],
      order: [[sequelize.fn("COUNT", sequelize.col("no_id")), "DESC"]],
      raw: true,
    });

    const node_views = nodeViewsRaw.map((row) => ({
      no_id: row.no_id,
      count: parseInt(row.count, 10),
    }));

    const periodoRaw = await ViewEvento.findOne({
      attributes: [
        [sequelize.fn("MIN", sequelize.col("criado_em")), "primeiro"],
        [sequelize.fn("MAX", sequelize.col("criado_em")), "ultimo"],
      ],
      where: { flow_id: flowId },
      raw: true,
    });

    return res.status(200).json({
      total_views,
      node_views,
      periodo: {
        primeiro: periodoRaw?.primeiro || null,
        ultimo: periodoRaw?.ultimo || null,
      },
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.getAnalyticsUsuario = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;

    const userFlows = await Flow.findAll({
      where: { criado_por: usuario_id },
      attributes: ["id", "titulo", "visualizacoes"],
      order: [["visualizacoes", "DESC"]],
      raw: true,
    });

    const total_flows = userFlows.length;
    const userFlowIds = userFlows.map((f) => f.id);

    let total_visualizacoes = 0;
    let top_flows = [];

    if (userFlowIds.length > 0) {
      const viewEventosRaw = await ViewEvento.findAll({
        attributes: [
          "flow_id",
          [sequelize.fn("COUNT", sequelize.col("id")), "view_eventos"],
        ],
        where: { flow_id: { [Op.in]: userFlowIds } },
        group: ["flow_id"],
        raw: true,
      });

      const viewEventosMap = {};
      viewEventosRaw.forEach((row) => {
        viewEventosMap[row.flow_id] = parseInt(row.view_eventos, 10);
      });

      total_visualizacoes = userFlows.reduce(
        (acc, f) => acc + (f.visualizacoes || 0),
        0
      );

      top_flows = userFlows.slice(0, 5).map((f) => ({
        id: f.id,
        titulo: f.titulo,
        visualizacoes: f.visualizacoes || 0,
        view_eventos: viewEventosMap[f.id] || 0,
      }));
    }

    const forks_recebidos = userFlowIds.length > 0
      ? await Flow.count({ where: { fork_de: { [Op.in]: userFlowIds } } })
      : 0;

    const execucoes_concluidas = await Execucao.count({
      where: { usuario_id, status: "concluida" },
    });

    return res.status(200).json({
      total_visualizacoes,
      total_flows,
      forks_recebidos,
      execucoes_concluidas,
      top_flows,
    });
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
