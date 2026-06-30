'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleCategory.belongsTo(models.Couple, { as: 'couple', foreignKey: 'coupleId' });
    }
  }
  CoupleCategory.init({
    coupleId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CoupleCategory',
  });
  return CoupleCategory;
};