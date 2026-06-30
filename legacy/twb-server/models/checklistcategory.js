'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChecklistCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChecklistCategory.hasMany(models.Checklist, { as: 'checklists', foreignKey: 'checklistCategoryId' });
    }
  }
  ChecklistCategory.init({
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChecklistCategory',
  });
  return ChecklistCategory;
};