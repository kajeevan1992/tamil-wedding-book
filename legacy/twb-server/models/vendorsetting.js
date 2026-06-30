'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorSetting.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorSetting.init({
    vendorId: DataTypes.INTEGER,
    monthlyNewsletter: DataTypes.BOOLEAN,
    trainingEmails: DataTypes.BOOLEAN,
    improvementTips: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'VendorSetting',
  });
  return VendorSetting;
};