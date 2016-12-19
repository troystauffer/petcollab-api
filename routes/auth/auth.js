'use strict';

let db = {};
let log = {};
let config = {};
let pwcrypt = {};
let jwt = {};

function Auth(_db,  _pwcrypt, _jwt, _config, _log) {
  db = _db;
  log = _log;
  config = _config;
  pwcrypt = _pwcrypt;
  jwt = _jwt;
  return this;
};

Auth.prototype.auth = function(req, res) {
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email must be a valid email address.').isEmail();
  req.checkBody('password', 'A valid password is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  db.User.findOne({ where: { email: req.body.email }})
  .then(function(user) {
    if (!user) return res.status(400).json({ message: 'No such user.'});
    pwcrypt.verify( user.salt, user.password_hash, req.body.password, function( err, valid ) {
      if (err) return res.status(500).json({ message: 'An error occurred decrypting the password.', errors: err });
      if (!valid) return res.status(400).json({ message: 'Invalid password.' });
      jwt.sign({ user_id: user.id }, config.sessionKey, { expiresIn: '24h' }, function(err, token) {
        if (err) return res.status(500).json({ message: 'Unable to generate token.' });
        return res.status(200).json({ message: 'Authenticated successfully.', token: token });
      })
    });
  });
};

module.exports = Auth;