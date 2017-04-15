'use strict';
module.exports = function(sequelize, DataTypes) {
  var ScheduleItem = sequelize.define('ScheduleItem', {
    title: { type: DataTypes.STRING, allowNull: true, validate: { notEmpty: true }},
    schdeule_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Schedules', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
    assigned_user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
    starts_at: DataTypes.DATE,
    ends_at: DataTypes.DATE,
    order: DataTypes.INTEGER
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        ScheduleItem.belongsTo(models.Schedule, {
          foreignKey: 'schedule_id'
        });
        ScheduleItem.belongsTo(models.User, {
          foreignKey: 'assigned_user_id'
        });
      }
    }
  });
  return ScheduleItem;
};