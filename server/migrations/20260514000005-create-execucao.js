"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("execucao", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        allowNull: false,
      },
      flow_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "flow", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "usuario", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("em_progresso", "concluida", "cancelada"),
        allowNull: false,
        defaultValue: "em_progresso",
      },
      iniciado_em: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      concluido_em: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("execucao");
  },
};
