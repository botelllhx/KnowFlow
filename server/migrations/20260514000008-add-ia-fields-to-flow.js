"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("flow", "tags_ia", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn("flow", "contexto_ia", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("flow", "tags_ia");
    await queryInterface.removeColumn("flow", "contexto_ia");
  },
};
