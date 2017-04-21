import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';

let _this = {};

class Auth extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  authenticate(req, res) {
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email must be a valid email address.').isEmail();
    req.checkBody('password', 'A valid password is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.log.info('Attempting to authenticate ' + req.body.email);
    _this.db.User.findOne({ where: { email: req.body.email }})
    .then(function(user) {
      if (!user) {
        _this.log.info('Email ' + req.body.email + ' not found.');
        return res.status(400).json(new RO({success: false, errors: [new ApiError({ type: 'auth.authenticate.user.not_found', message: 'No such user.' })]}));
      }
      try {
        _this.pwcrypt.verify(user.salt, user.password_hash, req.body.password, (err, valid) => {
          if (err) return res.status(500).json(new RO({ success: false, errors: [new ApiError({ type: 'auth.authenticate.password.invalid', message: 'An error occurred decrypting the password.', validations: err })]}));
          if (!valid) return res.status(400).json(new RO({ success: false, errors: [new ApiError({ type: 'auth.authenticate.password.invalid', message: 'Invalid password.' })]}));
          let token = generateToken({ user_id: user.id, email: user.email, name: user.name });
          _this.log.info('Generated token ' + token + ' for user ' + user.email);
          return res.status(200).json(new RO({ success:true, message: 'Authenticated successfully.', response: {token: token}}));
        });
      } catch(err) {
        _this.log.info('An error occurred decrypting the password for ' + req.body.email);
        return res.status(500).json(new RO({success: false, errors: [new ApiError({ type: 'auth.authenticate.unspecified', message: 'An error occurred. See errors for details.', validations: err })]}));
      }
    });
  }

  facebook(req, res) {
    req.checkBody('code', 'A facebook auth code is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.log.info('Attempting to validate facebook auth code ' + req.body.code);
    httpsRequest({
      host: _this.config.facebook.ogurl,
      path: '/v2.8/oauth/access_token?client_id=' + _this.config.facebook.clientID + '&client_secret=' + _this.config.facebook.clientSecret + '&code=' + req.body.code + '&redirect_uri=' + _this.config.facebook.redirectUri
    }, function(validation) {
      if (validation.error && validation.error.code == 190) {
        _this.log.info('Unable to validate code ' + req.body.code + ', error code 190. Error: ' + validation.error.toString());
        return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'auth.facebook.code.invalid', message: 'Invalid facebook code.' })]}));
      }
      if (validation.error || !validation.access_token) {
        _this.log.info('Unable to validate code ' + req.body.code + '. Error: ' + validation.error.toString());
        return res.status(500).json(new RO({ success: false, errors: [new ApiError({ type: 'auth.facebook.code.invalid', message: 'An error occurred validating the facebook code.' })]}));
      }
      httpsRequest({
        host: _this.config.facebook.ogurl,
        path: '/me?access_token=' + validation.access_token
      }, function(fbuser) {
        _this.log.info('Generating token for successful facebook auth for code ' + req.body.code);
        _this.db.User.findOrCreate({ where: { facebook_id: fbuser.id }})
        .spread(function(user, created) {
          if (created) {
            _this.log.info('Creating account for facebook auth user ' + fbuser.email);
            user.name = fbuser.name;
            user.email = fbuser.email;
            user.save()
            .then(function() {
              let token = generateToken({ user_id: user.id, facebook_access_token: validation.access_token });
              return res.status(200).json(new RO({ success: true, message: 'Authenticated successfully.', response: {token: token} }));
            });
          } else {
            let token = generateToken({ user_id: user.id, facebook_access_token: validation.access_token });
            return res.status(200).json(new RO({ success: true, message: 'Authenticated successfully.', response: {token: token} }));
          }
        });
      });
    });
  }
}

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