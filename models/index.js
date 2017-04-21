'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const Sequelize = require('sequelize');

let config = {};
let sequelize = {};
let db = {};

function DB(_config, log) {
  config = _config;
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
    log.info('Initialized database from ENV variable.');
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
    log.info('Initialized database from config.');
  }

  fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    log.info('Initialized model ' + model.name);
  });

  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}

module.exports = DB;