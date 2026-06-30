'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleVendors', {
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
      status: {
        type: Sequelize.ENUM,
        defaultValue: 'Evaluating',
        values: [
          'Not available',
          'Discarded',
          'Evaluating',
          'Preselection',
          'Negotiation',
          'Hired',
        ]
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      note: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('CoupleVendors');
  }
};