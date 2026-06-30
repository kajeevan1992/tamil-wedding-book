'use strict';
/** @type {import('sequelize-cli').Migration} */
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Users',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Categories',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: true
      },
      aboutStoreFront: {
        type: Sequelize.TEXT
      },
      reviewTemplate: {
        type: Sequelize.TEXT,
        defaultValue: `<p>Hi <strong>[recipient name]</strong>,</p><p>It was a pleasure to be a part of your wedding!</p> <br/><p>If you have a few moments, can you share your experience with other engaged couples on ${process.env.APP_DOMAIN}? Your review of our services will help them plan their wedding.</p> <br/><p>Thanks, </p> <br/><p>Regards,</p><p>[your name]</p>`,
      },
      faqs: {
        type: Sequelize.JSONB
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vendors');
  }
};