'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEventGuest extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEventGuest.belongsTo(models.CoupleWeddingEvent, { as: 'coupleWeddingEvent', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEventGuest.belongsTo(models.CoupleWeddingGuest, { as: 'coupleWeddingGuest', foreignKey: 'coupleWeddingGuestId' });
            CoupleWeddingEventGuest.belongsTo(models.CoupleWeddingEventGroup, { as: 'coupleWeddingEventGroup', foreignKey: 'coupleWeddingEventGroupId' });
            CoupleWeddingEventGuest.belongsTo(models.CoupleWeddingEventList, { as: 'coupleWeddingEventList', foreignKey: 'coupleWeddingEventListId' });
            CoupleWeddingEventGuest.belongsTo(models.CoupleWeddingEventTable, { as: 'coupleWeddingEventTable', foreignKey: 'coupleWeddingEventTableId' });
            CoupleWeddingEventGuest.belongsTo(models.CoupleWeddingEventMenu, { as: 'coupleWeddingEventMenu', foreignKey: 'coupleWeddingEventMenuId' });
        }
    }
    CoupleWeddingEventGuest.init({
        coupleWeddingEventId: DataTypes.INTEGER,
        coupleWeddingGuestId: DataTypes.INTEGER,
        coupleWeddingEventGroupId: DataTypes.INTEGER,
        coupleWeddingEventListId: DataTypes.INTEGER,
        coupleWeddingEventTableId: DataTypes.INTEGER,
        coupleWeddingEventMenuId: DataTypes.INTEGER,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEventGuest',
    });
    return CoupleWeddingEventGuest;
};