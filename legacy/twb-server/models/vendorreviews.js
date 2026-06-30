'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorReviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorReviews.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
      VendorReviews.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    }
  }

  VendorReviews.init({
    vendorId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    qualityOfService: DataTypes.INTEGER,
    professionalism: DataTypes.INTEGER,
    flexibility: DataTypes.INTEGER,
    valueForMoney: DataTypes.INTEGER,
    responseTime: DataTypes.INTEGER,
    reviewText: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'VendorReviews',
  });

  return VendorReviews;
};