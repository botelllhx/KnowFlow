const { Workspace, WorkspaceMembro } = require("../models");

/**
 * Middleware de autorização de workspace.
 * @param {string|null} requiredRole - 'admin', 'editor', ou null (qualquer membro)
 */
module.exports = (requiredRole = null) =>
  async (req, res, next) => {
    try {
      const userId = req.usuarioId;
      const workspaceId = req.params.id;

      const workspace = await Workspace.findByPk(workspaceId);
      if (!workspace) {
        return res.status(404).json({ erro: "Workspace não encontrado." });
      }

      const isCriador = workspace.criado_por === userId;

      const membro = await WorkspaceMembro.findOne({
        where: { workspace_id: workspaceId, usuario_id: userId },
      });

      const isMember = isCriador || !!membro;
      if (!isMember) {
        return res.status(403).json({ erro: "Acesso negado a este workspace." });
      }

      const role = isCriador ? "admin" : membro.role;
      const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };

      if (requiredRole && roleHierarchy[role] < roleHierarchy[requiredRole]) {
        return res
          .status(403)
          .json({ erro: `Permissão de ${requiredRole} necessária.` });
      }

      req.workspace = workspace;
      req.workspaceRole = role;
      next();
    } catch (error) {
      return res.status(500).json({ erro: "Erro de autorização." });
    }
  };
