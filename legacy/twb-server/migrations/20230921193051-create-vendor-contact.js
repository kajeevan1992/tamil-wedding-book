'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VendorContacts', {
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
      fullName: {
        type: Sequelize.STRING(150)
      },
      email: {
        type: Sequelize.STRING(255)
      },
      telephone: {
        type: Sequelize.STRING(100)
      },
      mobile: {
        type: Sequelize.STRING(100)
      },
      fax: {
        type: Sequelize.STRING(100)
      },
      website: {
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
    await queryInterface.dropTable('VendorContacts');
  }
};