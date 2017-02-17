'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'password_hash', { type: Sequelize.TEXT }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'users',
      'password_hash', { type: Sequelize.STRING }
    );
  }
};
