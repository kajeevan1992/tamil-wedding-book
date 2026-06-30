'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Couple extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Couple.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
      Couple.hasOne(models.WeddingDetail, { as: 'weddingDetail', foreignKey: 'coupleId' });
      Couple.hasMany(models.CoupleCategory, { as: 'coupleCategories', foreignKey: 'coupleId' });
      Couple.hasMany(models.Checklist, { as: 'checklists', foreignKey: 'coupleId' });
      Couple.hasMany(models.CoupleVendor, { as: 'coupleVendors', foreignKey: 'coupleId' });
      Couple.hasMany(models.CoupleWeddingEvent, { as: 'coupleWeddingEvents', foreignKey: 'coupleId' });
      Couple.hasMany(models.CoupleWeddingGuest, { as: 'coupleWeddingGuests', foreignKey: 'coupleId' });
      Couple.hasOne(models.CoupleBudgetPlanner, { as: 'coupleBudgetPlanner', foreignKey: 'coupleId' });
    }

    toJSON() {
      return Object.assign({}, this.get());
    }
  }
  Couple.init({
    userId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
  }, {
    hooks: {
      afterCreate: (couple, options) => {
        sequelize.models.CoupleBudgetPlanner.create({
          coupleId: couple.id,
          estimatedCost: 6403.00
        });
      }
    },
    sequelize,
    modelName: 'Couple',
  });

  return Couple;
};