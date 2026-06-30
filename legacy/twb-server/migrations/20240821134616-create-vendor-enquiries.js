"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("VendorEnquiries", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            vendorId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "Vendors",
                        field: "id",
                    },
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "Users",
                        field: "id",
                    },
                    key: "id",
                },
                allowNull: true,
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
            type: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            fullName: Sequelize.STRING(100),
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: false,
            },
            phone: Sequelize.STRING(20),
            eventDate: Sequelize.DATE,
            guestsCount: Sequelize.INTEGER,
            message: Sequelize.TEXT,
            status: {
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: "Pending",
            },
            replyText: Sequelize.TEXT,
            readByVendor: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: new Date(),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("VendorEnquiries");
    },
};
