const Sequelize = require('sequelize');
const Model = Sequelize.Model;

module.exports = class Pet extends Model {
  static init(sequelize) {
    return super.init({
      name: { type: Sequelize.STRING, allowNull: false, validate: { notEmpty: true }},
      pet_type_id: { type: Sequelize.INTEGER, allowNull: false, validate: { notEmpty: true, isNumeric: true }},
      comments: { type: Sequelize.TEXT, allowNull: true }
    }, {
      underscored: true,
      sequelize
    });
  }

  static associate(models) {
    this.belongsTo(models.PetType, { foreignKey: 'pet_type_id' });
    this.hasMany(models.Transfer, { foreignKey: 'pet_id' });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      pet_type_id: this.pet_type_id,
      pet_type: this.PetType,
      comments: this.comments,
      transfers: this.Transfers
    };
  }
}
