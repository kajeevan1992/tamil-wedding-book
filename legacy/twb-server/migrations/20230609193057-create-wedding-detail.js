'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WeddingDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      coupleId: {
        type: Sequelize.INTEGER,
        references: {
          model:
          {
            tableName: 'Couples',
            field: 'id'
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      partnerName: {
        type: Sequelize.STRING(191),
      },
      partnerEmail: {
        type: Sequelize.STRING(255),
        unique: true,
      },
      partnerPhoto: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.DATE,
      },
      guests: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING(255),
      },
      location: {
        type: Sequelize.GEOMETRY,
      },
      venue: {
        type: Sequelize.STRING(191),
      },
      startTime: {
        type: Sequelize.STRING(25),
      },
      endTime: {
        type: Sequelize.STRING(25),
      },
      color: {
        type: Sequelize.STRING(35),
        defaultValue: 'rgb(211, 223, 158)'
      },
      cardPhoto: {
        type: Sequelize.TEXT,
        defaultValue: 'wedding/card-photo.jpeg'
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
    await queryInterface.dropTable('WeddingDetails');
  }
};