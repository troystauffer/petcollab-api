'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
    starts_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    ends_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    owner_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, validate: { notEmpty: true, isNumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Event.hasMany(models.Schedule, {
          foreignKey: 'event_id'
        });
        Event.belongsTo(models.User, {
          foreignKey: 'owner_user_id'
        });
      }
    }
  });
  return Event;
};