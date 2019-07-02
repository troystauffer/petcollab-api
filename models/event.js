const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class Event extends Model {
  static init(sequelize) {
    return super.init({
      title: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true }},
      starts_at: { type: Sequelize.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
      ends_at: { type: Sequelize.DATE, allowNull: true, validate: { isDate: true, notEmpty: true }},
      owner_user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' },
        validate: { notEmpty: true, isNumeric: true }},
      releasing_rescue_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Rescues', key: 'id' },
        validate: { notEmpty: false }},
      receiving_rescue_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Rescues', key: 'id' },
        validate: { notEmpty: false }}
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.Schedule, { foreignKey: 'event_id' });
    this.belongsTo(models.User, { foreignKey: 'owner_user_id' });
    this.belongsTo(models.Rescue, {
      foreignKey: 'releasing_rescue_id',
      as: 'ReleasingRescue'
    });
    this.belongsTo(models.Rescue, {
      foreignKey: 'receiving_rescue_id',
      as: 'ReceivingRescue'
    });
    this.hasMany(models.Transfer, { foreignKey: 'event_id' });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      starts_at: this.starts_at,
      ends_at: this.ends_at,
      owner_user_id: this.owner_user_id,
      owner: this.User,
      releasing_rescue_id: this.releasing_rescue_id,
      releasing_rescue: this.ReleasingRescue,
      receiving_rescue_id: this.receiving_rescue_id,
      receiving_rescue: this.ReceivingRescue,
      transfers: this.Transfers
    };
  }
};
