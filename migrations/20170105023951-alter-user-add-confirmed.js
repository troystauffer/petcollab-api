'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'confirmed',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      }
    );
    return queryInterface.addColumn(
      'Users',
      'confirmation_token',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'confirmed');
    return queryInterface.removeColumn('Users', 'confirmation_token');
  }
};
