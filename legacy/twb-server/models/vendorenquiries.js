"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class VendorEnquiries extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VendorEnquiries.belongsTo(models.Vendor, {
                as: "vendor",
                foreignKey: "vendorId",
            });
            VendorEnquiries.belongsTo(models.User, {
                as: "user",
                foreignKey: "userId",
            });
        }
    }

    VendorEnquiries.init(
        {
            vendorId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            type: DataTypes.STRING,
            fullName: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            eventDate: DataTypes.DATE,
            guestsCount: DataTypes.INTEGER,
            message: DataTypes.TEXT,
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Pending",
            },
            replyText: DataTypes.TEXT,
            readByVendor: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "VendorEnquiries",
        }
    );

    return VendorEnquiries;
};
