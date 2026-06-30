'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorDeal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorDeal.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorDeal.init({
    vendorId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    validity: DataTypes.DATE,
    discount: DataTypes.DOUBLE, // will general discount the checkboxes on this page http://localhost:3000/venue/storefront/deals
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VendorDeal',
  });
  return VendorDeal;
};