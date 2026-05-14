const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const ViewEvento = sequelize.define(
  "view_evento",
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
    no_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "view_evento" }
);

module.exports = ViewEvento;
