'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorBusinessIdentity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorBusinessIdentity.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
      VendorBusinessIdentity.belongsTo(models.BusinessIdentity, { as: 'businessIdentity', foreignKey: 'businessIdentityId' });
    }
  }

  VendorBusinessIdentity.init({
    vendorId: DataTypes.INTEGER,
    businessIdentityId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'VendorBusinessIdentity',
  });

  return VendorBusinessIdentity;
};