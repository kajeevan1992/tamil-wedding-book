'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleWeddingEventTables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupleWeddingEventId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleWeddingEvents',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(191)
      },
      type: Sequelize.STRING(70),
      position: {
        type: Sequelize.JSONB,
        defaultValue: { x: 211, y: 122 },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CoupleWeddingEventTables');
  }
};