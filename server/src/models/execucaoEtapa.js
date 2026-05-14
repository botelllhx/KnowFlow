const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const ExecutacaoEtapa = sequelize.define(
  "execucao_etapa",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    execucao_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    no_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pendente", "concluido"),
      allowNull: false,
      defaultValue: "pendente",
    },
    observacao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    evidencia_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    concluido_em: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false, tableName: "execucao_etapa" }
);

module.exports = ExecutacaoEtapa;
