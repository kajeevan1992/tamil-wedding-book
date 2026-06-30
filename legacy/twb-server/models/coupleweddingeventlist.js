'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEventList extends Model {
        /** 
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEventList.belongsTo(models.CoupleWeddingEvent, { as: 'coupleWeddingEvent', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEventList.hasMany(models.CoupleWeddingEventGuest, { as: 'coupleWeddingEventGuests', foreignKey: 'coupleWeddingEventListId' });
        }
    }
    CoupleWeddingEventList.init({
        coupleWeddingEventId: DataTypes.INTEGER,
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEventList',
    });
    return CoupleWeddingEventList;
};