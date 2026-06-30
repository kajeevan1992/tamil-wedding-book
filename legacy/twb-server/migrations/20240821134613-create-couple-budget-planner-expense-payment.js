'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CoupleBudgetPlannerExpensePayments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expenseId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'CoupleBudgetPlannerCategoryExpenses',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      paid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      paymentDate: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      dueDate: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      paidBy: {
        type: Sequelize.STRING(30)
      },
      paymentMethod: {
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('CoupleBudgetPlannerExpensePayments');
  }
};