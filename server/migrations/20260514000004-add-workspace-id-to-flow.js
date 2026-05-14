"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("flow", "workspace_id", {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: "workspace", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("flow", "workspace_id");
  },
};
