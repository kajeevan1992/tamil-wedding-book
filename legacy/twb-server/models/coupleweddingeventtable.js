'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEventTable extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEventTable.belongsTo(models.CoupleWeddingEvent, { as: 'coupleWeddingEvent', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEventTable.hasMany(models.CoupleWeddingEventGuest, { as: 'coupleWeddingEventGuests', foreignKey: 'coupleWeddingEventTableId' });
            CoupleWeddingEventTable.hasMany(models.CoupleWeddingEventTableChair, { as: 'coupleWeddingEventTableChairs', foreignKey: 'coupleWeddingEventTableId' });
        }
    }
    CoupleWeddingEventTable.init({
        coupleWeddingEventId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        position: DataTypes.JSONB,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEventTable',
    });
    return CoupleWeddingEventTable;
};