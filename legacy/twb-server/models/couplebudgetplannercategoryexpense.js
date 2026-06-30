'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleBudgetPlannerCategoryExpense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleBudgetPlannerCategoryExpense.belongsTo(models.CoupleBudgetPlannerCategory, { as: 'coupleBudgetPlannerCategory', foreignKey: 'coupleBudgetPlannerCategoryId' });
      CoupleBudgetPlannerCategoryExpense.hasMany(models.CoupleBudgetPlannerExpensePayment, { as: 'payments', foreignKey: 'expenseId' });
    }
  }
  CoupleBudgetPlannerCategoryExpense.init({
    coupleBudgetPlannerCategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    estimatedCost: DataTypes.DECIMAL,
    finalCost: DataTypes.DECIMAL,
    note: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CoupleBudgetPlannerCategoryExpense',
  });
  return CoupleBudgetPlannerCategoryExpense;
};