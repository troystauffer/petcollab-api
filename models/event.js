'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
    starts_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    ends_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Event.hasMany(models.Schedule, {
          foreignKey: 'event_id'
        });
      }
    }
  });
  return Event;
};