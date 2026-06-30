'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoupleWeddingGuest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CoupleWeddingGuest.belongsTo(models.Couple, { as: 'couple', foreignKey: 'coupleId' });
      // CoupleWeddingGuest.belongsTo(models.CoupleWeddingEventGroup, { as: 'coupleWeddingEventGroup', foreignKey: 'coupleWeddingEventGroupId' });
      // CoupleWeddingGuest.belongsTo(models.CoupleWeddingEventList, { as: 'coupleWeddingEventList', foreignKey: 'coupleWeddingEventListId' });
      // CoupleWeddingGuest.belongsTo(models.CoupleWeddingEventTable, { as: 'coupleWeddingEventTable', foreignKey: 'coupleWeddingEventTableId' });
      // CoupleWeddingGuest.belongsTo(models.CoupleWeddingEventMenu, { as: 'coupleWeddingEventMenu', foreignKey: 'coupleWeddingEventMenuId' });
      CoupleWeddingGuest.hasMany(models.CoupleWeddingGuest, { as: 'companions', foreignKey: 'companionOfId' });
      CoupleWeddingGuest.hasMany(models.CoupleWeddingEventGuest, { as: 'coupleWeddingGuestEvents', foreignKey: 'coupleWeddingGuestId' });
    }

    toJSON() {
      return Object.assign({}, this.get());
    }
  }
  CoupleWeddingGuest.init({
    coupleId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    age: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
    mobile: DataTypes.STRING,
    address: DataTypes.STRING,
    location: DataTypes.GEOMETRY,
    companionOfId: DataTypes.INTEGER,
  }, {
    // hooks: {
    //   afterCreate: (couple, options) => {
    //     // todo something with couple 
    //     // https://sequelize.org/docs/v6/other-topics/hooks/
    //   }
    // },
    sequelize,
    modelName: 'CoupleWeddingGuest',
  });
  return CoupleWeddingGuest;
};