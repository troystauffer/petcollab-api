'use strict';

let _this = {};

let Auth = function(args = {}) {
  Object.keys(args).map((key) => { _this[key] = args[key]; });
};

Auth.prototype.auth = function(req, res) {
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email must be a valid email address.').isEmail();
  req.checkBody('password', 'A valid password is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  _this.db.User.findOne({ where: { email: req.body.email }})
  .then(function(user) {
    if (!user) return res.status(400).json({ message: 'No such user.'});
      try {
        _this.pwcrypt.verify( user.salt, user.password_hash, req.body.password, function( err, valid ) {
          if (err) return res.status(500).json({ message: 'An error occurred decrypting the password.', errors: err });
          if (!valid) return res.status(400).json({ message: 'Invalid password.' });
          let token = generateToken({ user_id: user.id, email: user.email, name: user.name });
          return res.status(200).json({ message: 'Authenticated successfully.', token: token });
        });
      } catch(err) {
        return res.status(500).json(err);
      }
    });
};

Auth.prototype.facebook = function(req, res) {
  req.checkBody('code', 'A facebook auth code is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json({ message: 'The data provided to the API was invalid or incomplete.', errors: errors });
  httpsRequest({
    host: _this.config.facebook.ogurl,
    path: '/v2.8/oauth/access_token?client_id=' + _this.config.facebook.clientID + '&client_secret=' + _this.config.facebook.clientSecret + '&code=' + req.body.code + '&redirect_uri=' + _this.config.facebook.redirectUri
  }, function(validation) {
    if (validation.error && validation.error.code == 190) return res.status(403).json({ message: 'Invalid facebook code.' });
    if (validation.error || !validation.access_token) return res.status(500).json({ message: 'An error occurred validating the facebook code.' });
    httpsRequest({
      host: _this.config.facebook.ogurl,
      path: '/me?access_token=' + validation.access_token
    }, function(fbuser) {
      _this.db.User.findOrCreate({ where: { facebook_id: fbuser.id }})
      .spread(function(user, created) {
        if (created) {
          user.name = fbuser.name;
          user.email = fbuser.email;
          user.save()
          .then(function() {
            let token = generateToken({ user_id: user.id, facebook_access_token: validation.access_token });
            return res.status(200).json({ message: 'Authenticated successfully.', token: token });
          });
        } else {
          let token = generateToken({ user_id: user.id, facebook_access_token: validation.access_token });
          return res.status(200).json({ message: 'Authenticated successfully.', token: token });
        }
      });
    });
  });
};

function generateToken(data) {
  return _this.jws.sign({
    header: { alg: _this.config.jws.algorithm },
    payload: data,
    secret: _this.config.jws.key
  });
}

function httpsRequest(options, cb) {
  _this.https.request(options, function(response) {
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