'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      password_hash: { type: Sequelize.TEXT },
      salt: { type: Sequelize.STRING },
      role_id: { type: Sequelize.INTEGER },
      confirmed: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      confirmation_token: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function() {
      queryInterface.createTable('roles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }).then(function() {
        queryInterface.createTable('events', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          title: { type: Sequelize.STRING },
          owner_user_id: { type: Sequelize.INTEGER },
          starts_at: { type: Sequelize.DATE },
          ends_at: { type: Sequelize.DATE },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE
          }
        }).then(function() {
          queryInterface.createTable('schedules', {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
            },
            title: { type: Sequelize.STRING },
            event_id: { type: Sequelize.INTEGER },
            created_at: {
              allowNull: false,
              type: Sequelize.DATE
            },
            updated_at: {
              allowNull: false,
              type: Sequelize.DATE
            }
          }).then(function() {
            queryInterface.createTable('schedule_items', {
              id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
              },
              title: { type: Sequelize.STRING },
              schedule_id: { type: Sequelize.INTEGER },
              assigned_user_id: { type: Sequelize.INTEGER },
              starts_at: { type: Sequelize.DATE },
              ends_at: { type: Sequelize.DATE },
              order: { type: Sequelize.INTEGER },
              created_at: {
                allowNull: false,
                type: Sequelize.DATE
              },
              updated_at: {
                allowNull: false,
                type: Sequelize.DATE
              }
            });
          });
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('schedule_items').then(function() {
      queryInterface.dropTable('schedules').then(function() {
        queryInterface.dropTable('events').then(function() {
          queryInterface.dropTable('roles').then(function() {
            queryInterface.dropTable('users');
          });
        });
      });
    });
  }
};
