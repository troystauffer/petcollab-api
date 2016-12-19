'use strict';

const express = require('express');
const path = require('path');
const app = express();
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const config = new (require(path.join(__dirname, 'config/')));
const log = (require('bunyan')).createLogger(config.log);
const validator = require('express-validator');
const router = express.Router();
const unsecuredRoutes = require(path.join(__dirname, 'config/unsecured_routes'));
const db = new (require(path.join(__dirname, 'models/')))(config.database);
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const EasyPbkdf2 = require('easy-pbkdf2');
const pwcrypt = EasyPbkdf2(config.easyPbkdf2);
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const authorized = require(path.join(__dirname, 'lib/authorized'))(jwt, config.sessionKey);

function App() {
  EventEmitter.call(this);
  let self = this;
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(cookieparser());
  app.use(validator());
  app.use(morgan(config.morgan.format, config.morgan.options));
  app.use('/v1', router);

  // router.use(jwt({secret:config.stormpath.secret}).unless({path: unsecuredRoutes}));
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