'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEventGroup extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEventGroup.belongsTo(models.CoupleWeddingEvent, { as: 'coupleWeddingEvent', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEventGroup.hasMany(models.CoupleWeddingEventGuest, { as: 'coupleWeddingEventGuests', foreignKey: 'coupleWeddingEventGroupId' });
        }
    }
    CoupleWeddingEventGroup.init({
        coupleWeddingEventId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        displayOrder: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEventGroup',
    });
    return CoupleWeddingEventGroup;
};