const { Flow, Usuario, Comentario, PostagemComunidade } = require("../models");
const { Op } = require("sequelize");

const flowController = {
  // Listar todos os flows (feed)
  async listar(req, res) {
    try {
      const { search, categoria } = req.query;

      const whereClause = { [Op.and]: [] };

      if (categoria) {
        whereClause[Op.and].push({ categoria });
      }

      if (search) {
        whereClause[Op.and].push({
          [Op.or]: [
            { tags: { [Op.contains]: [search] } },
            { titulo: { [Op.iLike]: `%${search}%` } },
            { descricao: { [Op.iLike]: `%${search}%` } },
          ],
        });
      }

      const flows = await Flow.findAll({
        where: whereClause,
        include: [
          { model: Usuario, attributes: ["id", "nome", "avatar_url"] },
          {
            model: Comentario,
            include: { model: Usuario, attributes: ["id", "nome"] },
          },
        ],
        order: [["criado_em", "DESC"]],
      });

      res.json(flows);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar flows", detalhes: error.message });
    }
  },

  // Obter detalhes de um flow (incrementa visualizações)
  async obter(req, res) {
    try {
      const flow = await Flow.findByPk(req.params.id, {
        include: [
          { model: Usuario, attributes: ["id", "nome", "email", "cargo", "empresa", "avatar_url"] },
          {
            model: Comentario,
            include: { model: Usuario, attributes: ["id", "nome"] },
            order: [["criado_em", "ASC"]],
          },
        ],
      });

      if (!flow) {
        return res.status(404).json({ erro: "Flow não encontrado" });
      }

      // Incrementa visualizações de forma não-bloqueante
      flow.increment("visualizacoes").catch(() => {});

      res.json(flow);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar flow", detalhes: error.message });
    }
  },

  // Criar um novo flow
  async criar(req, res) {
    try {
      const { titulo, descricao, conteudo_nos, conteudo_conexoes, categoria, tags, status, post_id } = req.body;

      if (post_id) {
        const postRelacionado = await PostagemComunidade.findByPk(post_id);
        if (!postRelacionado) {
          return res.status(400).json({ erro: "Post relacionado não encontrado" });
        }
      }

      const novoFlow = await Flow.create({
        titulo,
        descricao,
        conteudo_nos,
        conteudo_conexoes,
        categoria,
        tags,
        status: status || "rascunho",
        post_id: post_id || null,
        criado_por: req.usuarioId,
      });

      res.status(201).json({
        mensagem: "Flow criado com sucesso",
        flow_id: novoFlow.id,
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar flow", detalhes: error.message });
    }
  },

  // Atualizar um flow (somente quem criou)
  async atualizar(req, res) {
    try {
      const flow = await Flow.findByPk(req.params.id);

      if (!flow) {
        return res.status(404).json({ erro: "Flow não encontrado" });
      }

      if (flow.criado_por !== req.usuarioId) {
        return res.status(403).json({ erro: "Permissão negada" });
      }

      const { titulo, descricao, conteudo_nos, conteudo_conexoes, categoria, tags, status } = req.body;

      await flow.update({ titulo, descricao, conteudo_nos, conteudo_conexoes, categoria, tags, status });

      res.json({ mensagem: "Flow atualizado com sucesso", id: flow.id });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar flow", detalhes: error.message });
    }
  },

  // Deletar um flow
  async deletar(req, res) {
    try {
      const flow = await Flow.findByPk(req.params.id);

      if (!flow) {
        return res.status(404).json({ erro: "Flow não encontrado" });
      }

      if (flow.criado_por !== req.usuarioId) {
        return res.status(403).json({ erro: "Permissão negada" });
      }

      await flow.destroy();
      res.json({ mensagem: "Flow deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao deletar flow", detalhes: error.message });
    }
  },

  // Fork de um flow existente
  async fork(req, res) {
    try {
      const flowOriginal = await Flow.findByPk(req.params.id);

      if (!flowOriginal) {
        return res.status(404).json({ erro: "Flow não encontrado" });
      }

      const { titulo, descricao } = req.body;

      const novoFlow = await Flow.create({
        titulo: titulo || `Fork de: ${flowOriginal.titulo}`,
        descricao: descricao || flowOriginal.descricao,
        conteudo_nos: flowOriginal.conteudo_nos,
        conteudo_conexoes: flowOriginal.conteudo_conexoes,
        categoria: flowOriginal.categoria,
        tags: flowOriginal.tags,
        status: "rascunho",
        fork_de: flowOriginal.id,
        criado_por: req.usuarioId,
      });

      res.status(201).json({
        mensagem: "Flow forkado com sucesso",
        flow_id: novoFlow.id,
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao forkar flow", detalhes: error.message });
    }
  },
};

module.exports = flowController;
