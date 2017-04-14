'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ScheduleItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      schdeule_id: {
        type: Sequelize.INTEGER
      },
      assigned_user_id: {
        type: Sequelize.INTEGER
      },
      starts_at: {
        type: Sequelize.DATE
      },
      ends_at: {
        type: Sequelize.DATE
      },
      order: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ScheduleItems');
  }
};