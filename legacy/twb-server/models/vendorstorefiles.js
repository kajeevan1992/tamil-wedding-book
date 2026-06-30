'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorStoreFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorStoreFiles.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorStoreFiles.init({
    vendorId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    extension: DataTypes.STRING,
    // main: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'VendorStoreFiles',
  });
  return VendorStoreFiles;
};