'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VendorDeals', {
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
      name: {
        type: Sequelize.STRING(255)
      },
      type: {
        type: Sequelize.STRING(50)
      },
      validity: {
        type: Sequelize.DATE
      },
      discount: {
        type: Sequelize.DOUBLE
      },
      description: {
        type: Sequelize.TEXT
      },
      image: {
        type: Sequelize.STRING(255)
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
    await queryInterface.dropTable('VendorDeals');
  }
};