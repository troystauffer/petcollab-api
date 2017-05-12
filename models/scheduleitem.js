'use strict';
module.exports = function(sequelize, DataTypes) {
  var ScheduleItem = sequelize.define('ScheduleItem', {
    title: { type: DataTypes.STRING, allowNull: true, validate: { notEmpty: true }},
    schedule_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Schedules', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
    assigned_user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
    starts_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    ends_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    order: DataTypes.INTEGER,
    checked_in_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        ScheduleItem.belongsTo(models.Schedule, { foreignKey: 'schedule_id' });
        ScheduleItem.belongsTo(models.User, { foreignKey: 'assigned_user_id' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        return {
          id: this.id,
          title: this.title,
          schedule_id: this.schedule_id,
          schedule: this.Schedule,
          assigned_user_id: this.assigned_user_id,
          starts_at: this.starts_at,
          ends_at: this.ends_at,
          order: this.order,
          assigned_user: this.User,
          checked_in_at: this.checked_in_at
        };
      }
    }
  });
  return ScheduleItem;
};