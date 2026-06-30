"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query("CREATE EXTENSION postgis;");
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fullName: Sequelize.STRING(191), //? Maximum of 191 characters allowed
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            username: {
                type: Sequelize.STRING(191),
                unique: true,
            },
            password: Sequelize.STRING,
            photo: Sequelize.TEXT,
            address: Sequelize.STRING(255),
            location: Sequelize.GEOMETRY,
            weddingStyle: {
                type: Sequelize.ENUM,
                defaultValue: "Traditional Hindu Wedding",
                values: [
                    "Traditional Hindu Wedding",
                    "Brahmin Wedding",
                    "Christian Wedding",
                    "Muslim Wedding",
                    "Arya Vysya Wedding",
                    "Dravidian (Non-Brahmin) Wedding",
                    "Destination Weddings",
                    "Simplified/Elopement Weddings",
                    "Mixed Faith Weddings",
                ],
            },
            telephone: Sequelize.STRING(50),
            role: {
                type: Sequelize.STRING,
                defaultValue: "couple",
                allowNull: false,
            },
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            verificationCode: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            verificationCodeExpiry: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            verified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            stepsDone: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            storeFrontFirstStepDone: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            storeFrontSecondStepDone: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            storeFrontThirdStepDone: {
                type: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable("Users");
        await queryInterface.sequelize.query("DROP EXTENSION postgis;");
    },
};
