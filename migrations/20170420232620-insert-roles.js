'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(queryInterface.QueryGenerator.bulkInsertQuery('Roles', [
      {
        title: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }, { 
        title: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }, { 
        title: 'super_admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query(queryInterface.QueryGenerator.deleteQuery('Roles'));
  }
};
