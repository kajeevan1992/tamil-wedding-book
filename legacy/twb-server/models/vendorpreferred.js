'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorPreferred extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorPreferred.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
      VendorPreferred.belongsTo(models.Vendor, { as: 'preferredVendor', foreignKey: 'preferredVendorId' });
    }

    toJSON() {
      return Object.assign({}, this.get());
    }
  }
  VendorPreferred.init({
    vendorId: DataTypes.INTEGER,
    preferredVendorId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'VendorPreferred',
  });
  return VendorPreferred;
};