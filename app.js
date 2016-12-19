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
const passport = require('passport');
const jwt = require('express-jwt');
const unsecuredRoutes = require(path.join(__dirname, 'config/unsecured_routes'));
const db = new (require(path.join(__dirname, 'models/')))(config.database);
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const EasyPbkdf2 = require('easy-pbkdf2');
const pwcrypt = EasyPbkdf2(config.easyPbkdf2)

function App() {
  EventEmitter.call(this);
  let self = this;
  app.use(expressSession({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({ client: redis.createClient() })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  app.use(cookieparser());
  app.use(validator());
  app.use('/v1', router);

  // router.use(jwt({secret:config.stormpath.secret}).unless({path: unsecuredRoutes}));

  // set 'unauthorized' response
  router.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
    if (err.name === 'UnauthorizedError') res.status(401).json({success:false,message:'Token missing or invalid.'});
  });


  // define routes
  require(path.join(__dirname, 'routes/user'))(router, db, pwcrypt, log);
  require(path.join(__dirname, 'routes/auth'))(router, passport, db, pwcrypt, log);

  let server = app.listen(config.port);
  log.info('Web app started on port ' + config.port + '...');
  self.emit('listening', {server: server, app: app});
}

App.prototype.getApp = function() { return app; };

util.inherits(App, EventEmitter);

module.exports = App;