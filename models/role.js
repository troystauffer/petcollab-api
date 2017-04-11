'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    title: DataTypes.STRING
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