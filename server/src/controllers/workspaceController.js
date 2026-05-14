const { Op } = require("sequelize");
const { Workspace, WorkspaceMembro, Flow, Usuario, sequelize } = require("../models");

const workspaceController = {
  async listar(req, res) {
    try {
      const userId = req.usuarioId;

      const membros = await WorkspaceMembro.findAll({
        where: { usuario_id: userId },
        attributes: ["workspace_id"],
      });
      const memberIds = membros.map((m) => m.workspace_id);

      const whereClause = {
        [Op.or]: [{ criado_por: userId }],
      };
      if (memberIds.length > 0) {
        whereClause[Op.or].push({ id: { [Op.in]: memberIds } });
      }

      const workspaces = await Workspace.findAll({
        where: whereClause,
        include: [
          { model: Usuario, as: "criador", attributes: ["id", "nome"] },
          {
            model: WorkspaceMembro,
            as: "membros",
            attributes: ["usuario_id", "role"],
          },
          {
            model: Flow,
            as: "flows",
            attributes: ["id"],
          },
        ],
        order: [["criado_em", "DESC"]],
      });

      return res.json(workspaces);
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao listar workspaces.", detalhes: error.message });
    }
  },

  async criar(req, res) {
    const t = await sequelize.transaction();
    try {
      const { nome, descricao } = req.body;
      if (!nome) {
        await t.rollback();
        return res.status(400).json({ erro: "Nome é obrigatório." });
      }

      const workspace = await Workspace.create(
        { nome, descricao: descricao || null, criado_por: req.usuarioId },
        { transaction: t }
      );

      await WorkspaceMembro.create(
        {
          workspace_id: workspace.id,
          usuario_id: req.usuarioId,
          role: "admin",
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(201).json(workspace);
    } catch (error) {
      await t.rollback();
      return res
        .status(500)
        .json({ erro: "Erro ao criar workspace.", detalhes: error.message });
    }
  },

  async obter(req, res) {
    try {
      const { id } = req.params;

      const workspace = await Workspace.findByPk(id, {
        include: [
          { model: Usuario, as: "criador", attributes: ["id", "nome", "cargo"] },
          {
            model: WorkspaceMembro,
            as: "membros",
            include: [
              {
                model: Usuario,
                as: "usuario",
                attributes: ["id", "nome", "cargo", "avatar_url"],
              },
            ],
          },
        ],
      });

      if (!workspace) {
        return res.status(404).json({ erro: "Workspace não encontrado." });
      }

      const flows = await Flow.findAll({
        where: { workspace_id: id },
        include: [{ model: Usuario, attributes: ["id", "nome"] }],
        order: [["criado_em", "DESC"]],
      });

      return res.json({ ...workspace.toJSON(), flows });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao buscar workspace.", detalhes: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { nome, descricao, logo_url } = req.body;
      await req.workspace.update({ nome, descricao, logo_url });
      return res.json(req.workspace);
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao atualizar workspace.", detalhes: error.message });
    }
  },

  async deletar(req, res) {
    try {
      if (req.workspace.criado_por !== req.usuarioId) {
        return res
          .status(403)
          .json({ erro: "Apenas o criador pode deletar o workspace." });
      }
      await req.workspace.destroy();
      return res.json({ mensagem: "Workspace removido com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao deletar workspace.", detalhes: error.message });
    }
  },

  async adicionarMembro(req, res) {
    try {
      const { email, role = "viewer" } = req.body;
      if (!email) {
        return res.status(400).json({ erro: "Email é obrigatório." });
      }
      if (!["admin", "editor", "viewer"].includes(role)) {
        return res.status(400).json({ erro: "Role inválida." });
      }

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const existing = await WorkspaceMembro.findOne({
        where: { workspace_id: req.params.id, usuario_id: usuario.id },
      });
      if (existing) {
        return res
          .status(409)
          .json({ erro: "Usuário já é membro deste workspace." });
      }

      const membro = await WorkspaceMembro.create({
        workspace_id: req.params.id,
        usuario_id: usuario.id,
        role,
      });

      return res.status(201).json({
        ...membro.toJSON(),
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          cargo: usuario.cargo,
          avatar_url: usuario.avatar_url,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao adicionar membro.", detalhes: error.message });
    }
  },

  async removerMembro(req, res) {
    try {
      const { userId } = req.params;

      if (userId === req.workspace.criado_por) {
        return res
          .status(400)
          .json({ erro: "Não é possível remover o criador do workspace." });
      }

      const membro = await WorkspaceMembro.findOne({
        where: { workspace_id: req.params.id, usuario_id: userId },
      });
      if (!membro) {
        return res.status(404).json({ erro: "Membro não encontrado." });
      }

      await membro.destroy();
      return res.json({ mensagem: "Membro removido com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao remover membro.", detalhes: error.message });
    }
  },

  async atualizarRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["admin", "editor", "viewer"].includes(role)) {
        return res.status(400).json({ erro: "Role inválida." });
      }

      const membro = await WorkspaceMembro.findOne({
        where: { workspace_id: req.params.id, usuario_id: userId },
      });
      if (!membro) {
        return res.status(404).json({ erro: "Membro não encontrado." });
      }

      await membro.update({ role });
      return res.json(membro);
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao atualizar role.", detalhes: error.message });
    }
  },

  async adicionarFlow(req, res) {
    try {
      const { flowId } = req.params;
      const flow = await Flow.findByPk(flowId);
      if (!flow) {
        return res.status(404).json({ erro: "Flow não encontrado." });
      }
      if (flow.criado_por !== req.usuarioId) {
        return res.status(403).json({
          erro: "Apenas o criador do flow pode adicioná-lo ao workspace.",
        });
      }

      await flow.update({ workspace_id: req.params.id });
      return res.json({ mensagem: "Flow adicionado ao workspace." });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao adicionar flow.", detalhes: error.message });
    }
  },

  async removerFlow(req, res) {
    try {
      const { flowId } = req.params;
      const flow = await Flow.findByPk(flowId);
      if (!flow) {
        return res.status(404).json({ erro: "Flow não encontrado." });
      }
      if (flow.workspace_id !== req.params.id) {
        return res
          .status(400)
          .json({ erro: "Flow não pertence a este workspace." });
      }
      if (flow.criado_por !== req.usuarioId) {
        return res.status(403).json({
          erro: "Apenas o criador do flow pode removê-lo do workspace.",
        });
      }

      await flow.update({ workspace_id: null });
      return res.json({ mensagem: "Flow removido do workspace." });
    } catch (error) {
      return res
        .status(500)
        .json({ erro: "Erro ao remover flow.", detalhes: error.message });
    }
  },
};

module.exports = workspaceController;
