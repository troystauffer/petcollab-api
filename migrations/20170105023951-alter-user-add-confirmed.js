'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'users',
      'confirmed',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    );
    return queryInterface.addColumn(
      'users',
      'confirmation_token',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'confirmed');
    return queryInterface.removeColumn('users', 'confirmation_token');
  }
};
