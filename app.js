'use strict';

const path = require('path');
// framework
const express = require('express');
const app = express();
const router = express.Router();
const validator = require('express-validator');
// configuration
const config = new (require(path.join(__dirname, 'config/')));
const unsecuredRoutes = require(path.join(__dirname, 'config/unsecured_routes'));
// utils
const bodyparser = require('body-parser');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const jwt = require('jsonwebtoken');
// persistance
const db = new (require(path.join(__dirname, 'models/')))(config.database);
const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
// security
const EasyPbkdf2 = require('easy-pbkdf2');
const pwcrypt = EasyPbkdf2(config.easyPbkdf2);
// logging
const log = (require('bunyan')).createLogger(config.log);
const morgan = require('morgan');
// custom middleware
const authorized = require(path.join(__dirname, 'lib/authorized'))(jwt, config.sessionKey);

function App() {
  EventEmitter.call(this);
  let self = this;
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(validator());
  app.use(morgan(config.morgan.format, config.morgan.options));
  app.use('/v1', router);

  router.use(authorized.unless({ path: unsecuredRoutes }));

  // define routes
  require(path.join(__dirname, 'routes/user'))(router, db, pwcrypt, log);
  require(path.join(__dirname, 'routes/auth'))(router, db, pwcrypt, jwt, config, log);

  let server = app.listen(config.port);
  log.info('Web app started on port ' + config.port + '...');
  self.emit('listening', {server: server, app: app});
}

App.prototype.getApp = function() { return app; };

util.inherits(App, EventEmitter);

module.exports = App;