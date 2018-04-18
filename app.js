'use strict';

const path = require('path');
// framework
const express = require('express');
const app = express();
const router = express.Router();
const validator = require('express-validator');
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
const https = require('https');
// persistance
const db = new (require(path.join(__dirname, 'models/')))(config.database, log);
// security
const EasyPbkdf2 = require('easy-pbkdf2');
const pwcrypt = EasyPbkdf2(config.easyPbkdf2);
const UserToken = new (require(path.join(__dirname, 'lib/user_token')))(db);
const encryption = new (require(path.join(__dirname, 'lib/encryption')))({ config: config.encryption });
// custom middleware
const authenticated = require(path.join(__dirname, 'lib/authenticated'))(jws, config.jws, encryption, log);

function App() {
  EventEmitter.call(this);
  let self = this;
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(validator());
  app.use(morgan(config.morgan.format, config.morgan.options));
  app.use(config.apiPrefix, router);

  router.use(authenticated.unless({ path: unsecuredRoutes }));

  // define routes
  new (require(path.join(__dirname, 'routes/user')))(router, { 'db': db, 'pwcrypt': pwcrypt, 'config': config, 'UserToken': UserToken, 'log': log });
  new (require(path.join(__dirname, 'routes/auth')))(router, { 'db': db, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'encryption': encryption, 'log': log, 'https': https });
  new (require(path.join(__dirname, 'routes/event')))(router, { 'db': db, 'log': log });
  new (require(path.join(__dirname, 'routes/schedule')))(router, { 'db': db, 'log': log });
  new (require(path.join(__dirname, 'routes/schedule_item')))(router, { 'db': db, 'log': log });
  new (require(path.join(__dirname, 'routes/pet')))(router, { 'db': db, 'log': log });
  new (require(path.join(__dirname, 'routes/rescue')))(router, { 'db': db, 'log': log });
  new (require(path.join(__dirname, 'routes/fields')))(router, { 'db': db, 'log': log });

  let server = app.listen(config.port);
  log.info('Web app started on port ' + config.port + '...');
  self.emit('listening', {server: server, app: app});
}

App.prototype.getApp = function() { return app; };

util.inherits(App, EventEmitter);

module.exports = App;
