'use strict';

const FacebookStrategy = require('passport-facebook').Strategy;
let passport = {};
let db = {};
let log = {};
let config = {};

function User(_passport, _db, _config, _log) {
  passport = _passport;
  db = _db;
  log = _log;
  config = _config;
  passport.use(new FacebookStrategy({
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
      db.User.findOrCreate({ where: { facebook_id: profile.id }, defaults: { name: profile.displayName }})
      .then(function(user) {
        return cb(null, user);
      });
    }
  ));
  passport.serializeUser(function(user, done) {
    done(null, user[0]);
  });
  passport.deserializeUser(function(user, done) {
    db.User.findOne({ where: { facebook_id: user.facebook_id }})
    .then(function(u) {
      if (u) return done(null, u);
    });
  });
  return this;
}

User.prototype.info = function(req, res) {
  return res.status(200).json({
    user: req.user
  });
};

module.exports = User;