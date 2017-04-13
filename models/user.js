'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    name: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    salt: DataTypes.STRING,
    confirmation_token: DataTypes.STRING,
    confirmed: DataTypes.DATE,
    role_id: { 
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id'
      },
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Role, {
          foreignKey: 'role_id'
        });
      }
    },
    instanceMethods: {
      isConfirmed: function(done) {
        return done(confirmed != nil);
      }
    }
  });
  return User;
};