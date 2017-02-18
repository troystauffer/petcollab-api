import Sequelize from 'Sequelize';

module.exports = {
  User: {
    create: function() {
      return new Sequelize.Promise(function(resolve, reject) {
        resolve({id:1});
      });
    },
    findOrCreate: function() {
      return new Sequelize.Promise(function(resolve, reject) {
        resolve({id:1});
      });
    },
    findOne: function() {
      return new Sequelize.Promise(function(resolve, reject) {
        resolve({id:1});
      });
    },
    describe: function() {
      return new Sequelize.Promise(function(resolve, reject) {
        resolve(userDescribe);
      })
    }
  }
}