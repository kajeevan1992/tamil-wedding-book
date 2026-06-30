'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vendor.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
      Vendor.belongsTo(models.Category, { as: 'category', foreignKey: 'categoryId' });
      Vendor.hasOne(models.VendorContact, { as: 'contactPerson', foreignKey: 'vendorId' });
      Vendor.hasMany(models.VendorBusinessIdentity, { as: 'vendorBusinessIdentities', foreignKey: 'vendorId' });
      Vendor.hasMany(models.VendorStoreFiles, { as: 'vendorStoreFiles', foreignKey: 'vendorId' });
      Vendor.hasMany(models.VendorEvent, { as: 'vendorEvents', foreignKey: 'vendorId' });
      Vendor.hasOne(models.VendorSocialLink, { as: 'vendorSocialLinks', foreignKey: 'vendorId' });
      Vendor.hasMany(models.VendorPreferred, { as: 'vendorPreferreds', foreignKey: 'vendorId' });
      Vendor.hasOne(models.VendorPreferred, { as: 'preferredVendor', foreignKey: 'preferredVendorId' });
      Vendor.hasOne(models.VendorSetting, { as: 'vendorSetting', foreignKey: 'vendorId' });
      Vendor.hasOne(models.CoupleVendor, { as: 'coupleVendor', foreignKey: 'vendorId' });
      Vendor.hasMany(models.VendorEnquiries, { as: 'vendorEnquiries', foreignKey: 'vendorId' });
    }

    toJSON() {
      return Object.assign({}, this.get());
    }
  }
  Vendor.init({
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    aboutStoreFront: DataTypes.TEXT,
    reviewTemplate: DataTypes.TEXT,
    faqs: DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  return Vendor;
};