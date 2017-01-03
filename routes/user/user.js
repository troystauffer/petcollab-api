'use strict';

let log = {};
let db = {};
let pwcrypt = {};
const _ = require('lodash');

function User(_db, _pwcrypt, _log) {
  db = _db;
  log = _log;
  pwcrypt = _pwcrypt;
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
      user.save()
      .then(function() {
        return res.status(201).json({ message: 'Account created successfully.' });
      })
      .catch(function(err) {
        return res.status(500).json({ message: 'An error occurred creating the account.', errors: err });
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
    var obj = _.omit(table, ["id", "facebook_id", "createdAt", "updatedAt", "password_hash", "salt"]);
    obj["password"] = { "type": "password", "allowNull": false, "primaryKey": false };
    return res.json(obj);
  });
};

module.exports = User;