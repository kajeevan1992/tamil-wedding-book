'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleBudgetPlannerCategoryExpenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupleBudgetPlannerCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleBudgetPlannerCategories',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(30)
      },
      estimatedCost: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      finalCost: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      note: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('CoupleBudgetPlannerCategoryExpenses');
  }
};