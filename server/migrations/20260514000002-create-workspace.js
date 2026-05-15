"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("workspace", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      logo_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      criado_por: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "usuario", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      criado_em: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workspace");
  },
};
