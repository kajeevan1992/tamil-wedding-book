'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorContact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorContact.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorContact.init({
    vendorId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    fax: DataTypes.STRING,
    website: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VendorContact',
  });
  return VendorContact;
};