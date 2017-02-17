'use strict';

let db = {};
let log = {};
let config = {};
let pwcrypt = {};
let jws = {};
const https = require('https');

function Auth(_db,  _pwcrypt, _jws, _config, _log) {
  db = _db;
  log = _log;
  config = _config;
  pwcrypt = _pwcrypt;
  jws = _jws;
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
      generateToken({ user_id: user.id, email: user.email, name: user.name }, function(status, json) { return res.status(status).json(json); });
    });
  });
};

Auth.prototype.facebook = function(req, res) {
  req.checkBody('code', 'A facebook auth code is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  httpsRequest({
    host: config.facebook.ogurl,
    path: '/v2.8/oauth/access_token?client_id=' + config.facebook.clientID + '&client_secret=' + config.facebook.clientSecret + '&code=' + req.body.code + '&redirect_uri=' + config.facebook.redirectUri
  }, function(validation) {
    if (validation.error && validation.error.code == 190) return res.status(403).json({ message: 'Invalid facebook code.' });
    if (validation.error || !validation.access_token) return res.status(500).json({ message: 'An error occurred validating the facebook code.' });
    httpsRequest({
      host: config.facebook.ogurl,
      path: '/me?access_token=' + validation.access_token
    }, function(fbuser) {
      db.User.findOrCreate({ where: { facebook_id: fbuser.id }})
      .spread(function(user, created) {
        if (created) {
          user.name = fbuser.name;
          user.email = fbuser.email;
          user.save()
          .then(function() {
            generateToken({ user_id: user.id, facebook_access_token: validation.access_token }, function(status, json) { return res.status(status).json(json); });
          })
          .catch(function(err) {
            return res.status(500).json({ message: 'An error occurred creating the account.', errors: err });
          });
        } else {
          generateToken({ user_id: user.id, facebook_access_token: validation.access_token }, function(status, json) { return res.status(status).json(json); });
        }
      });
    });
  });
};

function generateToken(data, cb) {
  const token = jws.sign({
    header: { alg: config.jws.algorithm },
    payload: data,
    secret: config.jws.key
  });
  cb(200, { message: 'Authenticated successfully.', token: token })
}

function httpsRequest(options, cb) {
  https.request(options, function(response) {
    let str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      cb(JSON.parse(str));
    });
  }).end();
}

module.exports = Auth;