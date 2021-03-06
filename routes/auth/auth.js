import BaseRoute from '../base_route';
let _this = {};

class Auth extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  authenticate(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.log.info('Attempting to authenticate ' + req.body.email);
    _this.db.User.findOne({ where: { email: req.body.email }, include: [ 'Role' ]}).then(function(user) {
      if (!user) {
        _this.log.info('Email ' + req.body.email + ' not found.');
        return res.status(400).json({ success: false, errors: [{
          type: 'auth.authenticate.user.not_found',
          message: 'No such user.'
        }]});
      }
      try {
        _this.pwcrypt.verify(user.salt, user.password_hash, req.body.password, (err, valid) => {
          if (err) return res.status(500).json({ success: false, errors: [{
            type: 'auth.authenticate.password.invalid',
            message: 'An error occurred decrypting the password.'
          }]});
          if (!valid) return res.status(400).json({ success: false, errors: [{
            type: 'auth.authenticate.password.invalid',
            message: 'Invalid password.'
          }]});
          let token = generateToken({ user_id: user.id, email: user.email, name: user.name });
          _this.log.info('Generated token ' + token + ' for user ' + user.email);
          return res.status(200).json({ success:true, message: 'Authenticated successfully.',
            response: { token: token, role: user.Role }});
        });
      } catch(err) {
        _this.log.info('An error occurred decrypting the password for ' + req.body.email);
        return res.status(500).json({success: false, errors: [{
          type: 'auth.authenticate.unspecified',
          message: 'An error occurred. See errors for details.',
          validations: err
        }]});
      }
    });
  }
}

function generateToken(data) {
  let token = _this.jws.sign({
    header: { alg: _this.config.jws.algorithm },
    payload: data,
    secret: _this.config.jws.key
  });
  return _this.encryption.encrypt(token);
}

module.exports = Auth;