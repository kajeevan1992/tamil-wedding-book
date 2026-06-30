'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Checklist.belongsTo(models.Couple, { as: 'couple', foreignKey: 'coupleId' });
      Checklist.belongsTo(models.ChecklistCategory, { as: 'checklistCategory', foreignKey: 'checklistCategoryId' });
      Checklist.belongsTo(models.ChecklistFilter, { as: 'checklistFilter', foreignKey: 'checklistFilterId' });
      Checklist.belongsTo(models.Category, { as: 'vendorCategory', foreignKey: 'vendorCategoryId' });
      Checklist.belongsTo(models.CoupleBudgetPlannerCategory, { as: 'budgetPlannerCategory', foreignKey: 'budgetPlannerCategoryId' });
    }

    toJSON() {
      return Object.assign({}, this.get());
    }
  }
  Checklist.init({
    coupleId: DataTypes.INTEGER,
    checklistCategoryId: DataTypes.INTEGER,
    checklistFilterId: DataTypes.INTEGER,
    vendorType: DataTypes.STRING,
    vendorCategoryId: DataTypes.INTEGER,
    budgetPlannerCategoryId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    note: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Checklist',
  });
  return Checklist;
};