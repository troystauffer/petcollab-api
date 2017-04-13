'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'email', { type: Sequelize.STRING }
    );
    queryInterface.addColumn(
      'Users',
      'password_hash', { type: Sequelize.STRING }
    );
    return queryInterface.addColumn(
      'Users',
      'salt', { type: Sequelize.STRING }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'email');
    queryInterface.removeColumn('Users', 'password_hash');
    return queryInterface.removeColumn('Users', 'salt');
  }
};
