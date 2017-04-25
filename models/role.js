'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, isAlphanumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Role.hasMany(models.User, { foreignKey: 'role_id' });
      }
    },
    instanceMethods: {
      toJSON: function() {
        return {
          id: this.id,
          title: this.title
        };
      }
    }
  });
  return Role;
};