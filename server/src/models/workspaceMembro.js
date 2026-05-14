const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const WorkspaceMembro = sequelize.define(
  "workspace_membro",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    workspace_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "editor", "viewer"),
      allowNull: false,
      defaultValue: "viewer",
    },
    adicionado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "workspace_membro" }
);

module.exports = WorkspaceMembro;
