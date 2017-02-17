'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'email', { type: Sequelize.STRING }
    );
    queryInterface.addColumn(
      'users',
      'password_hash', { type: Sequelize.STRING }
    );
    return queryInterface.addColumn(
      'users',
      'salt', { type: Sequelize.STRING }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'email');
    queryInterface.removeColumn('users', 'password_hash');
    return queryInterface.removeColumn('users', 'salt');
  }
};
