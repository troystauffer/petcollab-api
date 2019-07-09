const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class Schedule extends Model {
  static init(sequelize) {
    return super.init({
      title: { type: Sequelize.STRING, allowNull: true, validate: { notEmpty: true }},
      event_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Roles', key: 'id' },
        validate: { notEmpty: true, isNumeric: true }}
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
    this.hasMany(models.ScheduleItem, { foreignKey: 'schedule_id' });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      event_id: this.event_id,
      event: this.Event,
      schedule_items: this.ScheduleItems
    };
  }
};
