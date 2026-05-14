const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Usuario = require("./usuario");
const Curtida = require("./curtida");
const PostagemComunidade = require("./postagemComunidade");

const Flow = sequelize.define(
  "flow",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    titulo: DataTypes.STRING,
    descricao: DataTypes.TEXT,
    conteudo_nos: DataTypes.JSONB,
    conteudo_conexoes: DataTypes.JSONB,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    categoria: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("rascunho", "publicado", "arquivado"),
      defaultValue: "rascunho",
    },
    visualizacoes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    fork_de: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    post_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: PostagemComunidade,
        key: "id",
      },
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    tags_ia: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    contexto_ia: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    criado_por: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Usuario,
        key: "id",
      },
    },
  },
  { timestamps: false, tableName: "flow" }
);

module.exports = Flow;
