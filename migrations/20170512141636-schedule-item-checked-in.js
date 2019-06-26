'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'schedule_items',
      'checked_in_at',
      {
        allowNull: true,
        type: Sequelize.DATE
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('schedule_items', 'checked_in_at');
  }
};
