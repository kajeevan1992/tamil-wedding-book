'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CoupleWeddingEventTableChair extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CoupleWeddingEventTableChair.belongsTo(models.CoupleWeddingEventTable, { as: 'coupleWeddingEventTable', foreignKey: 'coupleWeddingEventTableId' });
            CoupleWeddingEventTableChair.belongsTo(models.CoupleWeddingGuest, { as: 'coupleWeddingGuest', foreignKey: 'coupleWeddingGuestId' });
        }
    }
    CoupleWeddingEventTableChair.init({
        coupleWeddingEventTableId: DataTypes.INTEGER,
        coupleWeddingGuestId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'CoupleWeddingEventTableChair',
    });
    return CoupleWeddingEventTableChair;
};