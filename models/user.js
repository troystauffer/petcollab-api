const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const SUPER_ADMIN_ROLE = 'super_admin';

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init({
      name: { type: Sequelize.STRING, allowNull: true, validate: { notEmpty: true }},
      email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true, notEmpty: true }},
      password_hash: { type: Sequelize.STRING, allowNull: true },
      salt: { type: Sequelize.STRING, allowNull: true },
      confirmation_token: { type: Sequelize.STRING, allowNull: true },
      confirmed: { type: Sequelize.DATE, allowNull: true },
      role_id: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'Roles', key: 'id' }, validate: { notEmpty: true, isNumeric: true }}
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.Role, { foreignKey: 'role_id' });
    this.hasMany(models.ScheduleItem, { foreignKey: 'assigned_user_id' });
    this.hasMany(models.Event, { foreignKey: 'owner_user_id' });
  }

  isConfirmed(done) {
    return done(this.confirmed != null);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      confirmed: this.confirmed,
      role_id: this.role_id,
      role: this.Role
    };
  }

  isSuperAdmin(callback) {
    User.sequelize.model('Role').findOne({ where: { title: SUPER_ADMIN_ROLE }}).then((role) => {
      return callback(this.role_id == role.id);
    });
  }
};
