'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('pet_types', [
      {
        title: 'Dog',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Cat',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('pet_types', null, {});
  }
};
