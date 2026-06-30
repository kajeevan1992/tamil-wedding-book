'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEventMenu extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEventMenu.belongsTo(models.CoupleWeddingEvent, { as: 'coupleWeddingEvent', foreignKey: 'coupleWeddingEventId' });
            CoupleWeddingEventMenu.hasMany(models.CoupleWeddingEventGuest, { as: 'coupleWeddingEventGuests', foreignKey: 'coupleWeddingEventMenuId' });
        }
    }
    CoupleWeddingEventMenu.init({
        coupleWeddingEventId: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEventMenu',
    });
    return CoupleWeddingEventMenu;
};