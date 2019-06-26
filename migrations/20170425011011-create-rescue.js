'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('rescues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.STRING },
      street_address: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      zip_code: { type: Sequelize.STRING },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      return queryInterface.addColumn('events', 'releasing_rescue_id', Sequelize.INTEGER);
    }).then(() => {
      return queryInterface.addColumn('events', 'receiving_rescue_id', Sequelize.INTEGER);
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('rescues').then(() => {
      return queryInterface.removeColumn('events', 'releasing_rescue_id');
    }).then(() => {
      return queryInterface.removeColumn('events', 'receiving_rescue_id');
    });
  }
};