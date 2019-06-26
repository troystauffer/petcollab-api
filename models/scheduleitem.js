const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class ScheduleItem extends Model {
  static init(sequelize) {
    return super.init({
      title: { type: Sequelize.STRING, allowNull: true, validate: { notEmpty: true }},
      schedule_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Schedules', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
      assigned_user_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Users', key: 'id' }, validate: { notEmpty: true, isNumeric: true }},
      starts_at: { type: Sequelize.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
      ends_at: { type: Sequelize.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
      order: Sequelize.INTEGER,
      checked_in_at: { type: Sequelize.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }}
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.Schedule, { foreignKey: 'schedule_id' });
    this.belongsTo(models.User, { foreignKey: 'assigned_user_id' });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      schedule_id: this.schedule_id,
      schedule: this.Schedule,
      assigned_user_id: this.assigned_user_id,
      starts_at: this.starts_at,
      ends_at: this.ends_at,
      order: this.order,
      assigned_user: this.User,
      checked_in_at: this.checked_in_at
    };
  }
}
