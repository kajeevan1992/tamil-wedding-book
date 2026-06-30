'use strict';

const list = require('./checklist-categories.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ChecklistCategories', list.categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChecklistCategories', null, {});
  }
};
