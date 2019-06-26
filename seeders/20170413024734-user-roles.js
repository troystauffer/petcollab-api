'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('roles', [
      {
        title: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'super_admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
