'use strict';

let log = {};
let db = {};
let pwcrypt = {};
let config = {};
let UserToken = {};
const _ = require('lodash');

function User(_db, _pwcrypt, _config, _UserToken, _log) {
  db = _db;
  pwcrypt = _pwcrypt;
  config = _config;
  UserToken = _UserToken;
  log = _log;
  return this;
}

User.prototype.create = function(req, res) {
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email must be a valid email address.').isEmail();
  req.checkBody('password', 'A valid password is required.').notEmpty();
  req.checkBody('name', 'A valid name is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  pwcrypt.secureHash(req.body.password, function( err, passwordHash, salt ) {
    if (err) return res.status(500).json({ message: 'An error occurred.', errors: err });
    db.User.findOrCreate({ where: { email: req.body.email }})
    .spread(function(user, created) {
      if (!created) return res.status(400).json({ message: 'User with this email already exists.'});
      user.password_hash = passwordHash;
      user.salt = salt;
      user.name = req.body.name;
      UserToken.generateToken(config.confirmationTokenLength, function(token) {
        log.info('Confirmation token generated for user ' + user.email + ': ' + token);
        user.confirmation_token = token;
        user.save()
        .then(function(user) {
          if (user) {
            return res.status(201).json({ message: 'Account created successfully.' });
          } else {
            return res.status(500).json({ message: 'An error occurred creating the account.', errors: err });
          }
        })
        .catch(function(err) {
          return res.status(500).json({ message: 'An error occurred creating the account.', errors: err });
        });
      });
    });
  });
};

User.prototype.info = function(req, res) {
  return res.status(200).json({
    user: req.user
  });
};

User.prototype.error = function(req, res) {
  return res.status(400).json({
    message: 'An error occurrred.'
  });
};

User.prototype.fields = function(req, res) {
  db.User.describe().then(function(table) {
    var obj = _.omit(table, ["id", "facebook_id", "createdAt", "updatedAt", "password_hash", "salt", "confirmed"]);
    obj["password"] = { "type": "password", "allowNull": false, "primaryKey": false };
    return res.json(obj);
  });
};

User.prototype.confirm = function(req, res) {
  req.checkBody('confirmation_token', 'A valid confirmation token is required.').notEmpty().isAlphanumeric().isLength(config.confirmationTokenLength);
  req.checkBody('email', 'A valid email is required.').notEmpty().isEmail();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  db.User.findOne({ where: { email: req.body.email, confirmation_token: req.body.confirmation_token }})
  .then(function(user) {
    if (user) {
      user.confirmed = Date();
      user.confirmation_token = null;
      user.save()
      .then(function(user) {
        if (user) {
          return res.status(200).json({ message: 'Confirmation successful.' });
        } else {
          return res.status(500).json({ message: 'An error occurred redeeming the token.' })
        }
      })
    } else {
      return res.status(400).json({ message: 'Email or token are invalid.' });
    }
  })
};

module.exports = User;