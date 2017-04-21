'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE "Users" ADD CONSTRAINT user_role_id_fkey FOREIGN KEY (role_id) REFERENCES "Roles" (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;').then(function() {
      queryInterface.sequelize.query('ALTER TABLE "Events" ADD CONSTRAINT event_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES "Users" (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;').then(function() {
        queryInterface.sequelize.query('ALTER TABLE "Schedules" ADD CONSTRAINT schedule_event_id_fkey FOREIGN KEY (event_id) REFERENCES "Events" (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;').then(function() {
          queryInterface.sequelize.query('ALTER TABLE "ScheduleItems" ADD CONSTRAINT schedule_items_schedule_id_fkey FOREIGN KEY (schedule_id) REFERENCES "Schedules" (id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE;');
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE "Users" DROP CONSTRAINT user_role_id_fkey;').then(function() {
      queryInterface.sequelize.query('ALTER TABLE "Events" DROP CONSTRAINT event_owner_user_id_fkey;').then(function() {
        queryInterface.sequelize.query('ALTER TABLE "Schedules" DROP CONSTRAINT schedule_event_id_fkey;').then(function() {
          queryInterface.sequelize.query('ALTER TABLE "ScheduleItems" DROP CONSTRAINT schedule_items_schedule_id_fkey;');
        });
      });
    });
  }
};
