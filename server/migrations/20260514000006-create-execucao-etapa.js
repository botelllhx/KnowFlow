"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("execucao_etapa", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
      },
      execucao_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "execucao", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      no_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pendente", "concluido"),
        allowNull: false,
        defaultValue: "pendente",
      },
      observacao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      evidencia_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      concluido_em: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("execucao_etapa");
  },
};
