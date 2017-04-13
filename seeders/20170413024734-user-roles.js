'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        title: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
