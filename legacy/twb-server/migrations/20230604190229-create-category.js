'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100)
      },
      slug: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING(100)
      },
      icon: {
        type: Sequelize.STRING(80),
      },
      primary: {
        type: Sequelize.STRING(80),
        defaultValue: false,
      },
      highlighted: {
        type: Sequelize.STRING(80),
        defaultValue: false,
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
    await queryInterface.dropTable('Categories');
  }
};