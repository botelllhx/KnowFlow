"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("workspace_membro", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
        allowNull: false,
      },
      workspace_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "workspace", key: "id" },
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
      role: {
        type: Sequelize.ENUM("admin", "editor", "viewer"),
        allowNull: false,
        defaultValue: "viewer",
      },
      adicionado_em: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("workspace_membro", ["workspace_id", "usuario_id"], {
      unique: true,
      name: "workspace_membro_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workspace_membro");
  },
};
