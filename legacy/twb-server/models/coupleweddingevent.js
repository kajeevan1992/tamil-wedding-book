'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEvent extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEvent.belongsTo(models.Couple, { as: 'couple', foreignKey: 'coupleId' });
            CoupleWeddingEvent.hasMany(models.CoupleWeddingEventGroup, { as: 'coupleWeddingEventGroups', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEvent.hasMany(models.CoupleWeddingEventMenu, { as: 'coupleWeddingEventMenus', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEvent.hasMany(models.CoupleWeddingEventTable, { as: 'coupleWeddingEventTables', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEvent.hasMany(models.CoupleWeddingEventList, { as: 'coupleWeddingEventLists', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEvent.hasMany(models.CoupleWeddingEventGuest, { as: 'coupleWeddingEventGuests', foreignKey: 'coupleWeddingEventId' });
        }
    }
    CoupleWeddingEvent.init({
        coupleId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        displayOrder: DataTypes.INTEGER,
        seatingChartWindowHeight: DataTypes.INTEGER,
        required: DataTypes.BOOLEAN,
        // hasMenu: DataTypes.BOOLEAN,
        // hasSeatingChart: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEvent',
    });
    return CoupleWeddingEvent;
};