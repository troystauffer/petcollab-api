'use strict';

const express = require('express');
const path = require('path');
const app = express();
const bodyparser = require('body-parser');
const config = new (require(path.join(__dirname, 'config/')));
const log = (require('bunyan')).createLogger(config.log);
const validator = require('express-validator');
const router = express.Router();
const passport = require('passport');
const jwt = require('express-jwt');
const db = new (require(path.join(__dirname, 'models/')))(config.database);
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function App() {
  EventEmitter.call(this);
  let self = this;
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(validator());
  app.use('/v1', router);

  // define routes
  require(path.join(__dirname, 'routes/user'))(router, passport, db, log);

  let server = app.listen(config.port);
  log.info('Web app started on port ' + config.port + '...');
  self.emit('listening', {server: server, app: app});
}

App.prototype.getApp = function() { return app; };

util.inherits(App, EventEmitter);

module.exports = App;