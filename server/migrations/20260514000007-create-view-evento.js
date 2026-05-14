"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("view_evento", {
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
      no_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      usuario_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "usuario", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      criado_em: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("view_evento", ["flow_id"]);
    await queryInterface.addIndex("view_evento", ["usuario_id"]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("view_evento");
  },
};
