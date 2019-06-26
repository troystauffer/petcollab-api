const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class Role extends Model {
  static init(sequelize) {
    return super.init({
      title: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true, isAlphanumeric: true }}
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'role_id' });
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title
    };
  }
};
