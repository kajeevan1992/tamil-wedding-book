'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorSocialLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorSocialLink.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorSocialLink.init({
    vendorId: DataTypes.INTEGER,
    facebook: DataTypes.STRING,
    instagram: DataTypes.STRING,
    twitter: DataTypes.STRING,
    pinterest: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VendorSocialLink',
  });
  return VendorSocialLink;
};