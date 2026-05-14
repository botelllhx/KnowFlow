const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Execucao = sequelize.define(
  "execucao",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    flow_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("em_progresso", "concluida", "cancelada"),
      allowNull: false,
      defaultValue: "em_progresso",
    },
    iniciado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    concluido_em: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false, tableName: "execucao" }
);

module.exports = Execucao;
