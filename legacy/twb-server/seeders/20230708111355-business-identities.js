'use strict';

const list = require('./business-identities.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('BusinessIdentities', list.businessIdentities, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BusinessIdentities', null, {});
  }
};