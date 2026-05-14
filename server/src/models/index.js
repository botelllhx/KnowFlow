const sequelize = require("../../db");
const Usuario = require("./usuario");
const Flow = require("./flow");
const Comentario = require("./comentario");
const Curtida = require("./curtida");
const FlowSalvo = require("./flowsalvo");
const PostagemComunidade = require("./postagemComunidade");
const ComentarioPostagem = require("./comentarioPostagem");
const Workspace = require("./workspace");
const WorkspaceMembro = require("./workspaceMembro");
const Execucao = require("./execucao");
const ExecutacaoEtapa = require("./execucaoEtapa");
const ViewEvento = require("./viewEvento");

const models = {
  Usuario,
  Flow,
  Comentario,
  Curtida,
  FlowSalvo,
  PostagemComunidade,
  ComentarioPostagem,
  Workspace,
  WorkspaceMembro,
  Execucao,
  ExecutacaoEtapa,
  ViewEvento,
};

Usuario.hasMany(Flow, { foreignKey: "criado_por" });
Flow.belongsTo(Usuario, { foreignKey: "criado_por" });

Usuario.hasMany(Comentario, { foreignKey: "usuario_id" });
Flow.hasMany(Comentario, { foreignKey: "flow_id" });
Comentario.belongsTo(Usuario, { foreignKey: "usuario_id" });
Comentario.belongsTo(Flow, { foreignKey: "flow_id" });

Usuario.hasMany(Curtida, { foreignKey: "usuario_id", as: "curtidas" });
Flow.hasMany(Curtida, { foreignKey: "flow_id", as: "curtidas" });
Curtida.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Curtida.belongsTo(Flow, { foreignKey: "flow_id", as: "flow" });

PostagemComunidade.hasMany(Curtida, { foreignKey: "post_id", as: "curtidas" });
Curtida.belongsTo(PostagemComunidade, {
  foreignKey: "post_id",
  as: "postagem",
});

Usuario.hasMany(FlowSalvo, {
  foreignKey: "usuario_id",
  as: "registrosFlowSalvo",
});
Flow.hasMany(FlowSalvo, {
  foreignKey: "flow_id",
  as: "registrosFlowSalvo",
});
FlowSalvo.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
FlowSalvo.belongsTo(Flow, { foreignKey: "flow_id", as: "flow" });

Usuario.belongsToMany(Flow, {
  through: FlowSalvo,
  as: "flowsSalvos",
  foreignKey: "usuario_id",
});
Flow.belongsToMany(Usuario, {
  through: FlowSalvo,
  as: "salvoPor",
  foreignKey: "flow_id",
});

Usuario.hasMany(PostagemComunidade, { foreignKey: "criado_por" });
PostagemComunidade.belongsTo(Usuario, { foreignKey: "criado_por", as: "criador" });

// Workspace associations
Workspace.belongsTo(Usuario, { foreignKey: "criado_por", as: "criador" });
Usuario.hasMany(Workspace, { foreignKey: "criado_por", as: "workspacesCriados" });

Workspace.hasMany(WorkspaceMembro, { foreignKey: "workspace_id", as: "membros" });
WorkspaceMembro.belongsTo(Workspace, { foreignKey: "workspace_id" });

WorkspaceMembro.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Usuario.hasMany(WorkspaceMembro, { foreignKey: "usuario_id", as: "membrosWorkspace" });

Workspace.hasMany(Flow, { foreignKey: "workspace_id", as: "flows" });
Flow.belongsTo(Workspace, { foreignKey: "workspace_id", as: "workspace" });

// Execucao associations
Execucao.belongsTo(Flow, { foreignKey: "flow_id", as: "flow" });
Execucao.belongsTo(Usuario, { foreignKey: "usuario_id", as: "usuario" });
Flow.hasMany(Execucao, { foreignKey: "flow_id", as: "execucoes" });
Execucao.hasMany(ExecutacaoEtapa, { foreignKey: "execucao_id", as: "etapas" });
ExecutacaoEtapa.belongsTo(Execucao, { foreignKey: "execucao_id" });

// ViewEvento associations
ViewEvento.belongsTo(Flow, { foreignKey: "flow_id" });
Flow.hasMany(ViewEvento, { foreignKey: "flow_id", as: "viewEventos" });
ViewEvento.belongsTo(Usuario, { foreignKey: "usuario_id" });

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
