'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VendorStoreFiles', {
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
      description: {
        type: Sequelize.STRING(255)
      },
      name: {
        type: Sequelize.STRING(255)
      },
      path: {
        type: Sequelize.STRING(255)
      },
      extension: {
        type: Sequelize.STRING(5)
      },
      // main: {
      //   type: Sequelize.BOOLEAN,
      //   defaultValue: false
      // },
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
    await queryInterface.dropTable('VendorStoreFiles');
  }
};