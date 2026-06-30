'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleWeddingEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupleId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Couples',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },
      displayOrder: Sequelize.INTEGER,
      seatingChartWindowHeight: {
        type: Sequelize.INTEGER,
        defaultValue: 600,
      },
      required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      // hasMenu: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: true,
      // },
      // hasSeatingChart: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: true,
      // },
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
    await queryInterface.dropTable('CoupleWeddingEvents');
  }
};