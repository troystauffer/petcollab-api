const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class Rescue extends Model {
  static init(sequelize) {
    return super.init({
      name: { type: Sequelize.STRING, allowNull: true, validate: { notEmpty: true }},
      street_address: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      state: { type: Sequelize.STRING, allowNull: true },
      zip_code: { type: Sequelize.STRING, allowNull: true }
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.Event, {
      foreignKey: 'releasing_rescue_id',
      as: 'ReleasingEvents'
    });
    this.hasMany(models.Event, {
      foreignKey: 'receiving_rescue_id',
      as: 'ReceivingEvents'
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      street_address: this.street_address,
      city: this.city,
      state: this.state,
      zip_code: this.zip_code,
      releasing_events: this.ReleasingEvents,
      receiving_events: this.ReceivingEvents
    };
  }
}
