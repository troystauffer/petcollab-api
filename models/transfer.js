'use strict';
module.exports = function(sequelize, DataTypes) {
  var Transfer = sequelize.define('Transfer', {
    pet_id: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true }},
    event_id: { type: DataTypes.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true }}
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Transfer.belongsTo(models.Pet, { foreignKey: 'pet_id' });
        Transfer.belongsTo(models.Event, { foreignKey: 'event_id' });
      }
    }
  });
  return Transfer;
};