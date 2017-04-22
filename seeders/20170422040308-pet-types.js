'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PetTypes', [
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
    return queryInterface.bulkDelete('PetTypes', null, {});
  }
};
