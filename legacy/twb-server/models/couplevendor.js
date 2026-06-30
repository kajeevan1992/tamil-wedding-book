'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleVendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleVendor.belongsTo(models.Couple, {
        as: 'coupleVendors', foreignKey: 'coupleId',
      });
      CoupleVendor.belongsTo(models.Vendor, {
        as: 'coupleVendor', foreignKey: 'vendorId',
      });
    }

    toJSON() {
      return Object.assign({}, this.get());
    }
  }
  CoupleVendor.init({
    coupleId: DataTypes.INTEGER,
    vendorId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    rating: DataTypes.DECIMAL,
    price: DataTypes.DECIMAL,
    note: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CoupleVendor',
  });
  return CoupleVendor;
};