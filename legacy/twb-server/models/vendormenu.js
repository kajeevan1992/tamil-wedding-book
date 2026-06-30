'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorMenu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorMenu.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorMenu.init({
    vendorId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'VendorMenu',
  });
  return VendorMenu;
};