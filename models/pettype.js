'use strict';
module.exports = function(sequelize, DataTypes) {
  var PetType = sequelize.define('PetType', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, isAlphanumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        PetType.hasMany(models.Pet, { foreignKey: 'pet_type_id' });
      }
    }
  });
  return PetType;
};