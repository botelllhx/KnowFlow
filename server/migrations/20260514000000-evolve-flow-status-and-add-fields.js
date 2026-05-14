'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Adiciona novos valores ao ENUM de status
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_flow_status" ADD VALUE IF NOT EXISTS 'publicado';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_flow_status" ADD VALUE IF NOT EXISTS 'arquivado';
    `);

    // Adiciona campo visualizacoes
    await queryInterface.addColumn('flow', 'visualizacoes', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });

    // Adiciona campo fork_de (referência ao flow original)
    await queryInterface.addColumn('flow', 'fork_de', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'flow',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('flow', 'fork_de');
    await queryInterface.removeColumn('flow', 'visualizacoes');
    // Nota: PostgreSQL não suporta remoção de valores de ENUM diretamente
  },
};
