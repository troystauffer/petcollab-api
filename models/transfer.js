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
    },
    instanceMethods: {
      toJSON: function() {
        return {
          id: this.id,
          pet_id: this.pet_id,
          pet: this.Pet,
          event_id: this.event_id,
          event: this.Event
        };
      }
    }
  });
  return Transfer;
};