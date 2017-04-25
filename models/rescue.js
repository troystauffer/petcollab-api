'use strict';
module.exports = function(sequelize, DataTypes) {
  var Rescue = sequelize.define('Rescue', {
    name: { type: DataTypes.STRING, allowNull: true, validate: { notEmpty: true }},
    street_address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    zip_code: { type: DataTypes.STRING, allowNull: true }
  }, {
    underscored: true,
    classMethods: {
      associate: function(models) {
        Rescue.hasMany(models.Event, {
          foreignKey: 'releasing_rescue_id',
          as: 'ReleasingEvents'
        });
        Rescue.hasMany(models.Event, {
          foreignKey: 'receiving_rescue_id',
          as: 'ReceivingEvents'
        });
      }
    },
    instanceMethods: {
      toJSON: function() {
        return {
          id: this.id,
          name: this.name,
          street_address: this.street_address,
          city: this.city,
          state: this.state,
          zip_code: this.zip_code
        };
      }
    }
  });
  return Rescue;
};