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
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('express-jwt');
const db = new (require(path.join(__dirname, 'models/')))(config.database);
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function App() {
  EventEmitter.call(this);
  let self = this;

  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: "https://petcollab-api.herokuapp.com/v1/user/info"
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, user);
    }
  ));

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