'use strict';

let passport = {};
let db = {};
let log = {};
let pwcrypt = {};
const LocalStrategy = require('passport-local').Strategy;

function Auth(_passport, _db,  _pwcrypt, _log) {
  passport = _passport;
  db = _db;
  log = _log;
  pwcrypt = _pwcrypt;
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, done) {
        db.User.findOne({ where: { email: email }})
        .then(function(user) {
          if (!user) return done(null, false, { message: 'No such user.'});
          pwcrypt.verify( user.salt, user.password_hash, password, function( err, valid ) {
            if (err) return done(null, false, { message: 'An error occurred decrypting the password.', errors: err });
            if (!valid) return done(null, false, { message: 'Invalid password.' });
            return done(null, { id: user.id, token: 'asdf' });
          });
        });
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    db.User.findById(id)
    .then(function(u) {
      if (u) return done(null, u);
      return done(null, false);
    });
  });
  return this;
};

Auth.prototype.auth = function(req, res, next) {
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email must be a valid email address.').isEmail();
  req.checkBody('password', 'A valid password is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.status(401).json({ info: info.message });
    req.logIn(user, function(err) {
      if (err) return next(err);
      res.json({ token: user.token });
    });
  })(req, res, next);
};

module.exports = Auth;