'use strict';

const list = require('./checklist-filters.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ChecklistFilters', list.filters, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ChecklistFilters', null, {});
  }
};