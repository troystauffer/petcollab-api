'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
    starts_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    ends_at: { type: DataTypes.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
    owner_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
    releasing_rescue_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Rescues', key: 'id' }, validate: { notEmpty: false }},
    receiving_rescue_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Rescues', key: 'id' }, validate: { notEmpty: false }}
  }, {
    underscored: true,
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        Event.hasMany(models.Schedule, { foreignKey: 'event_id' });
        Event.belongsTo(models.User, { foreignKey: 'owner_user_id' });
        Event.belongsTo(models.Rescue, {
          foreignKey: 'releasing_rescue_id',
          as: 'ReleasingRescue'
        });
        Event.belongsTo(models.Rescue, {
          foreignKey: 'receiving_rescue_id',
          as: 'ReceivingRescue'
        });
        Event.hasMany(models.Transfer, { foreignKey: 'event_id' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        return {
          id: this.id,
          title: this.title,
          starts_at: this.starts_at,
          ends_at: this.ends_at,
          owner_user_id: this.owner_user_id,
          owner: this.User,
          releasing_rescue_id: this.releasing_rescue_id,
          releasing_rescue: this.ReleasingRescue,
          receiving_rescue_id: this.receiving_rescue_id,
          receiving_rescue: this.ReceivingRescue,
          transfers: this.Transfers
        };
      }
    }
  });
  return Event;
};