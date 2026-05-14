const { Execucao, ExecutacaoEtapa, Flow } = require("../models");

exports.criar = async (req, res) => {
  try {
    const { flow_id } = req.body;
    const usuario_id = req.usuario.id;

    if (!flow_id) return res.status(400).json({ erro: "flow_id é obrigatório." });

    const flow = await Flow.findByPk(flow_id);
    if (!flow) return res.status(404).json({ erro: "Flow não encontrado." });

    const execucao = await Execucao.create({
      flow_id,
      usuario_id,
      status: "em_progresso",
    });

    return res.status(201).json(execucao);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.listar = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const { flow_id } = req.query;

    const where = { usuario_id };
    if (flow_id) where.flow_id = flow_id;

    const execucoes = await Execucao.findAll({
      where,
      include: [{ model: ExecutacaoEtapa, as: "etapas" }],
      order: [["iniciado_em", "DESC"]],
    });

    return res.json(execucoes);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.obter = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const execucao = await Execucao.findOne({
      where: { id, usuario_id },
      include: [{ model: ExecutacaoEtapa, as: "etapas" }],
    });

    if (!execucao) return res.status(404).json({ erro: "Execução não encontrada." });

    return res.json(execucao);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.atualizarEtapa = async (req, res) => {
  try {
    const { id, noId } = req.params;
    const { observacao, evidencia_url } = req.body;
    const usuario_id = req.usuario.id;

    const execucao = await Execucao.findOne({ where: { id, usuario_id } });
    if (!execucao) return res.status(404).json({ erro: "Execução não encontrada." });
    if (execucao.status !== "em_progresso") {
      return res.status(400).json({ erro: "Execução já finalizada." });
    }

    const [etapa, created] = await ExecutacaoEtapa.findOrCreate({
      where: { execucao_id: id, no_id: noId },
      defaults: {
        status: "concluido",
        observacao: observacao || null,
        evidencia_url: evidencia_url || null,
        concluido_em: new Date(),
      },
    });

    if (!created) {
      await etapa.update({
        status: "concluido",
        observacao: observacao || etapa.observacao,
        evidencia_url: evidencia_url || etapa.evidencia_url,
        concluido_em: etapa.concluido_em || new Date(),
      });
    }

    return res.json(etapa);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.concluir = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const execucao = await Execucao.findOne({ where: { id, usuario_id } });
    if (!execucao) return res.status(404).json({ erro: "Execução não encontrada." });
    if (execucao.status !== "em_progresso") {
      return res.status(400).json({ erro: "Execução já finalizada." });
    }

    await execucao.update({
      status: "concluida",
      concluido_em: new Date(),
    });

    return res.json(execucao);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    const execucao = await Execucao.findOne({ where: { id, usuario_id } });
    if (!execucao) return res.status(404).json({ erro: "Execução não encontrada." });
    if (execucao.status !== "em_progresso") {
      return res.status(400).json({ erro: "Execução já finalizada." });
    }

    await execucao.update({ status: "cancelada" });

    return res.json(execucao);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
