'use strict';
module.exports = function(sequelize, DataTypes) {
  var Schedule = sequelize.define('Schedule', {
    title: { type: DataTypes.STRING, allowNull: true, validate: { notEmpty: true }},
    event_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Roles', key: 'id' }, validate: { notEmpty: true, isNumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Schedule.belongsTo(models.Event, { foreignKey: 'event_id' });
        Schedule.hasMany(models.ScheduleItem, { foreignKey: 'schedule_id' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        return {
          id: this.id,
          title: this.title,
          event_id: this.event_id,
          event: this.Event,
          schedule_items: this.ScheduleItems
        };
      }
    }
  });
  return Schedule;
};