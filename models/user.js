'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: true, validate: { notEmpty: true }},
    facebook_id: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true, notEmpty: true }},
    password_hash: { type: DataTypes.STRING, allowNull: true },
    salt: { type: DataTypes.STRING, allowNull: true },
    confirmation_token: { type: DataTypes.STRING, allowNull: true },
    confirmed: { type: DataTypes.DATE, allowNull: true },
    role_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Roles', key: 'id' }, validate: { notEmpty: true, isNumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Role, {
          foreignKey: 'role_id'
        });
        User.hasMany(models.ScheduleItem, {
          foreignKey: 'assigned_user_id'
        });
        User.hasMany(models.Event, {
          foreignKey: 'owner_user_id'
        });
      }
    },
    instanceMethods: {
      isConfirmed: function(done) {
        return done(confirmed != null);
      }
    }
  });
  return User;
};