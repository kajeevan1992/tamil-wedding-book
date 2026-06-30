'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VendorReviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Vendors',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Users',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      qualityOfService: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      professionalism: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      flexibility: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      valueForMoney: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      responseTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      reviewText: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ''
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VendorReviews');
  }
};