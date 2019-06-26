const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class Transfer extends Model {
  static init(sequelize) {
    return super.init({
      pet_id: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true }},
      event_id: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true }}
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.Pet, { foreignKey: 'pet_id' });
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
  }

  toJSON() {
    return {
      id: this.id,
      pet_id: this.pet_id,
      pet: this.Pet,
      event_id: this.event_id,
      event: this.Event
    };
  }
}
