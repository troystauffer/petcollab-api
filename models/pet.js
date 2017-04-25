'use strict';
module.exports = function(sequelize, DataTypes) {
  var Pet = sequelize.define('Pet', {
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
    pet_type_id: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true }},
    comments: { type: DataTypes.TEXT, allowNull: true }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Pet.belongsTo(models.PetType, { foreignKey: 'pet_type_id' });
        Pet.hasMany(models.Transfer, { foreignKey: 'pet_id' });
      }
    }
  });
  return Pet;
};