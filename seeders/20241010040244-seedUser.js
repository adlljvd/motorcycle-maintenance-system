'use strict';
const { readFile } = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(await readFile('./data/users.json', 'utf-8')).map(el => {
      delete el.id
      el.createdAt = new Date()
      el.updatedAt = new Date()

      return el
    })

    await queryInterface.bulkInsert('Users', data, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
