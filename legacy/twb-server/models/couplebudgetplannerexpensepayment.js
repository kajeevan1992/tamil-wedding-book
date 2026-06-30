'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleBudgetPlannerExpensePayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleBudgetPlannerExpensePayment.belongsTo(models.CoupleBudgetPlannerCategoryExpense, { as: 'coupleBudgetPlannerCategoryExpense', foreignKey: 'expenseId' });
    }
  }
  CoupleBudgetPlannerExpensePayment.init({
    expenseId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    paid: DataTypes.BOOLEAN,
    paymentDate: DataTypes.DATE,
    dueDate: DataTypes.DATE,
    paidBy: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CoupleBudgetPlannerExpensePayment',
  });
  return CoupleBudgetPlannerExpensePayment;
};