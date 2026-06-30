'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessIdentity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Associations
    }
  }

  BusinessIdentity.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BusinessIdentity',
  });

  return BusinessIdentity;
};