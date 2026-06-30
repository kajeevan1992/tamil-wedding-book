'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleBudgetPlannerCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleBudgetPlannerCategory.belongsTo(models.CoupleBudgetPlanner, { as: 'coupleBudgetPlanner', foreignKey: 'coupleBudgetPlannerId' });
      CoupleBudgetPlannerCategory.hasMany(models.CoupleBudgetPlannerCategoryExpense, { as: 'categoryExpenses', foreignKey: 'coupleBudgetPlannerCategoryId' });
      CoupleBudgetPlannerCategory.hasOne(models.Checklist, { as: 'checklist', foreignKey: 'budgetPlannerCategoryId' });
    }
  }
  CoupleBudgetPlannerCategory.init({
    coupleBudgetPlannerId: DataTypes.INTEGER,
    icon: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CoupleBudgetPlannerCategory',
  });
  return CoupleBudgetPlannerCategory;
};