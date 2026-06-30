'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notification.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    }
  }
  Notification.init({
    userId: DataTypes.INTEGER,
    icon: DataTypes.STRING,
    iconColor: DataTypes.STRING,
    type: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    seen: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};