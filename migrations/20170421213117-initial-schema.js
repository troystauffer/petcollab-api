'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
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
      facebook_id: { type: Sequelize.STRING },
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
      queryInterface.createTable('Roles', {
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
        queryInterface.createTable('Events', {
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
          queryInterface.createTable('Schedules', {
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
            queryInterface.createTable('ScheduleItems', {
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
    return queryInterface.dropTable('ScheduleItems').then(function() {
      queryInterface.dropTable('Schedules').then(function() {
        queryInterface.dropTable('Events').then(function() {
          queryInterface.dropTable('Roles').then(function() {
            queryInterface.dropTable('Users');
          });
        });
      });
    });
  }
};
