'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'ScheduleItems',
      'checked_in_at',
      {
        allowNull: true,
        type: Sequelize.DATE
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('ScheduleItems', 'checked_in_at');
  }
};
