'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WeddingDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      WeddingDetail.belongsTo(models.Couple, { as: 'couple', foreignKey: 'coupleId' });
    }
  }
  WeddingDetail.init({
    coupleId: DataTypes.INTEGER,
    partnerName: DataTypes.STRING,
    partnerEmail: DataTypes.STRING,
    partnerPhoto: DataTypes.STRING,
    date: DataTypes.DATE,
    guests: DataTypes.STRING,
    address: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    venue: DataTypes.STRING,
    color: DataTypes.STRING,
    cardPhoto: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'WeddingDetail',
  });
  return WeddingDetail;
};