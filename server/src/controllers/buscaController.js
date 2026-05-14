const { Flow } = require("../models");
const { Op } = require("sequelize");

exports.buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ erro: "Query deve ter ao menos 2 caracteres." });
    }
    const termo = q.trim();

    const flows = await Flow.findAll({
      where: {
        status: "publicado",
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${termo}%` } },
          { descricao: { [Op.iLike]: `%${termo}%` } },
          { categoria: { [Op.iLike]: `%${termo}%` } },
        ],
      },
      attributes: ["id", "titulo", "descricao", "categoria", "tags", "visualizacoes"],
      order: [["visualizacoes", "DESC"]],
      limit: 20,
    });

    // Também busca por tags (array contains)
    const flowsPorTag = await Flow.findAll({
      where: {
        status: "publicado",
        tags: { [Op.contains]: [termo.toLowerCase()] },
      },
      attributes: ["id", "titulo", "descricao", "categoria", "tags", "visualizacoes"],
      limit: 10,
    });

    // Merge e deduplica
    const ids = new Set(flows.map((f) => f.id));
    const merged = [...flows, ...flowsPorTag.filter((f) => !ids.has(f.id))];

    return res.json(merged);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.relacionados = async (req, res) => {
  try {
    const { id } = req.params;
    const flow = await Flow.findByPk(id);
    if (!flow) return res.status(404).json({ erro: "Flow não encontrado." });

    const where = {
      id: { [Op.ne]: id },
      status: "publicado",
    };

    // Busca por categoria similar OU tags em comum
    const condicoes = [{ categoria: flow.categoria }];
    if (flow.tags?.length) {
      condicoes.push({ tags: { [Op.overlap]: flow.tags } });
    }
    where[Op.or] = condicoes;

    const relacionados = await Flow.findAll({
      where,
      attributes: ["id", "titulo", "descricao", "categoria", "tags", "visualizacoes"],
      order: [["visualizacoes", "DESC"]],
      limit: 5,
    });

    return res.json(relacionados);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};

exports.contextoIA = async (req, res) => {
  try {
    const { id } = req.params;
    const flow = await Flow.findByPk(id, {
      attributes: ["id", "titulo", "descricao", "categoria", "tags", "tags_ia", "contexto_ia", "conteudo_nos"],
    });
    if (!flow) return res.status(404).json({ erro: "Flow não encontrado." });

    // Constrói contexto estruturado para uso com LLM
    const nos = (flow.conteudo_nos || []).map((no) => ({
      id: no.id,
      tipo: no.type,
      titulo: no.data?.title || no.data?.question || "",
      conteudo: no.data?.content || no.data?.description || "",
    }));

    const contexto = {
      flow_id: flow.id,
      titulo: flow.titulo,
      descricao: flow.descricao,
      categoria: flow.categoria,
      tags: flow.tags,
      tags_ia: flow.tags_ia,
      nos,
      total_nos: nos.length,
      contexto_ia: flow.contexto_ia,
    };

    return res.json(contexto);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor." });
  }
};
