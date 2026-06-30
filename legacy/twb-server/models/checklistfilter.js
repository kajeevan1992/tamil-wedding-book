'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChecklistFilter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChecklistFilter.hasMany(models.Checklist, { as: 'checklistFilters', foreignKey: 'checklistCategoryId' });
    }
  }
  ChecklistFilter.init({
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChecklistFilter',
  });
  return ChecklistFilter;
};