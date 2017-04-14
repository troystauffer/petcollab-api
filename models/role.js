'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notNull: true, notEmpty: true, isAlphanumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Role.hasMany(models.User, {
          foreignKey: 'role_id'
        });
      }
    }
  });
  return Role;
};