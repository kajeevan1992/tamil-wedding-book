'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category.hasOne(models.Vendor, { as: 'vendor', foreignKey: 'userId' });
      Category.hasMany(models.Vendor, { as: 'category', foreignKey: 'categoryId' });
      // User.hasOne(models.Vendor, { as: 'vendor', foreignKey: 'userId' });
      // Category.hasMany(models.SubCategory, { foreignKey: 'categoryId' });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    type: DataTypes.STRING,
    icon: DataTypes.STRING,
    primary: DataTypes.BOOLEAN,
    highlighted: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};