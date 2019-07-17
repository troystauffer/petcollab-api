'use strict';

const path = require('path');
// framework
const express = require('express');
const app = express();
const router = express.Router();
const Validator = require('express-validator');
const validationResult = Validator.validationResult;
// configuration
const config = new (require(path.join(__dirname, 'config/')));
const unsecuredRoutes = require(path.join(__dirname, 'config/unsecured_routes'))(config.apiPrefix);
// logging
const log = (require('bunyan')).createLogger(config.log);
const morgan = require('morgan');
// utils
const bodyparser = require('body-parser');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const jws = require('jws');
// persistance
const db = new (require(path.join(__dirname, 'models/')))(config.database, log);
// security
const EasyPbkdf2 = require('easy-pbkdf2');
const pwcrypt = EasyPbkdf2(config.easyPbkdf2);
const UserToken = new (require(path.join(__dirname, 'lib/user_token')))(db, log);
const encryption = new (require(path.join(__dirname, 'lib/encryption')))({ config: config.encryption });
// custom middleware
const authenticated = require(path.join(__dirname, 'lib/authenticated'))(jws, config.jws, encryption, log);
const validate = validationResult.withDefaults({ formatter: (error) => {
  return {
    value: error.value,
    message: error.msg,
    param: error.param,
    location: error.location
  };
}});
const crud = new (require(path.join(__dirname, 'lib/crud')))({ db: db, validate: validate });

function App() {
  EventEmitter.call(this);
  let self = this;
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(morgan(config.morgan.format, config.morgan.options));
  app.use(config.apiPrefix, router);

  // allow cross domain requests
  router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  router.use(authenticated.unless({ path: unsecuredRoutes }));

  // define routes
  const routeArgs = { db, pwcrypt, config, UserToken, log, jws, encryption, validate, crud };
  new (require(path.join(__dirname, 'routes/user')))(router, routeArgs);
  new (require(path.join(__dirname, 'routes/auth')))(router, routeArgs);
  new (require(path.join(__dirname, 'routes/event')))(router, routeArgs);
  new (require(path.join(__dirname, 'routes/schedule')))(router, routeArgs);
  new (require(path.join(__dirname, 'routes/schedule_item')))(router, routeArgs);
  new (require(path.join(__dirname, 'routes/pet')))(router, routeArgs);
  new (require(path.join(__dirname, 'routes/rescue')))(router, routeArgs);

  let server = app.listen(config.port);
  log.info('Web app started on port ' + config.port + '...');
  self.emit('listening', {server: server, app: app});
}

App.prototype.getApp = function() { return app; };

util.inherits(App, EventEmitter);

module.exports = App;
