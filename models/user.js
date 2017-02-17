'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    salt: DataTypes.STRING,
    confirmation_token: DataTypes.STRING,
    confirmed: DataTypes.DATE
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
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