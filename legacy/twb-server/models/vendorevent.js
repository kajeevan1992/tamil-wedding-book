'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VendorEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VendorEvent.belongsTo(models.Vendor, { as: 'vendor', foreignKey: 'vendorId' });
    }
  }
  VendorEvent.init({
    vendorId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    startDate: DataTypes.DATE,
    startTime: DataTypes.STRING,
    endDate: DataTypes.DATE,
    endTime: DataTypes.STRING,
    address: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'VendorEvent',
  });
  return VendorEvent;
};