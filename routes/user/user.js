import BaseRoute from '../base_route';
import Crud from '../../lib/crud';

let _this = {};

class User extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
    _this.create = this.create;
    _this.db.Role.findOne({ where: { title: 'user' }}).then((role) => {
      _this.userRole = role;
    });
  }

  createUser(req, res) {
    return _this.create(req, res, _this.userRole);
  }

  info(req, res) {
    _this.db.User.findByPk(req.user.user_id).then((user) => {
      return res.status(200).json({ success: true, response: { user }});
    });
  }

  error(req, res) {
    return res.status(400).json({success: false, errors: [{ type: 'user.error', message: 'An error occurred.' }]});
  }

  confirm(req, res) {
    req.checkBody('confirmation_token', 'A valid confirmation token is required.').notEmpty().isAlphanumeric().isLength(_this.config.confirmationTokenLength);
    req.checkBody('email', 'A valid email is required.').notEmpty().isEmail();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.User.findOne({ where: { email: req.body.email, confirmation_token: req.body.confirmation_token }}).then(function(user) {
      if (user) {
        user.confirmed = Date();
        user.confirmation_token = null;
        user.save().then(function(user) {
          if (user) {
            return res.status(200).json({success: true, message: 'Confirmation successful.' });
          } else {
            return res.status(500).json({success: false, errors: [{ type: 'user.confirm.token_error', message: 'An error occurred redeeming the token.' }]});
          }
        });
      } else {
        return res.status(400).json({success: false, errors: [{ type: 'user.confirm.params.invalid', message: 'Email or token are invalid.' }]});
      }
    });
  }

  create(req, res, role) {
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email must be a valid email address.').isEmail();
    req.checkBody('password', 'A valid password is required.').notEmpty();
    req.checkBody('name', 'A valid name is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.pwcrypt.secureHash(req.body.password, (err, passwordHash, salt) => {
      _this.log.info('secureHash');
      if (err) return res.status(500).json({success: false, errors: [{ type: 'user.create.unspecified', message: 'An error occurred. See validations for details.', validations: err }]});
      _this.db.User.findOrCreate({ where: { email: req.body.email }}).spread(function(user, created) {
        _this.log.info('user find or create');
        if (!created) return res.status(400).json({success: false, errors: [{ type: 'user.create.email.exists', message: 'User with this email already exists.'}]});
        _this.log.info('created');
        user.password_hash = passwordHash;
        user.salt = salt;
        user.name = req.body.name;
        _this.UserToken.generateToken(_this.config.confirmationTokenLength, function(token) {
          _this.log.info('Confirmation token generated for user ' + user.email + ': ' + token);
          user.confirmation_token = token;
          user.role_id = role.id;
          user.save().then(function() {
            return res.status(201).json({success: true, message: 'Account updated successfully.', response: { confirmation_token: token }});
          });
        });
      });
    });
  }

  update(req, res) {
    _this.db.User.findByPk(req.user.user_id).then((user) => {
      if (req.body.name) user.name = req.body.name;
      _this.pwcrypt.secureHash(req.body.password || '', (err, passwordHash, salt) => {
        if (err) return res.status(500).json({success: false, errors: [{ type: 'user.update.unspecified', message: 'An error occurred. See validations for details.', validations: err }]});
        if (passwordHash !== '') user.password_hash = passwordHash;
        if (salt !== '') user.salt = salt;
        user.save().then((user) => {
          return validateUser(user, res, err);
        });
      });
    });
  }

  list(req, res) {
    _this.log.info('User ' + req.user.email + ' requesting list of users...');
    super.isAuthorized('user.list', req.user.user_id, function(authorized) {
      if (!authorized) return res.status(403).json({ success: false, message: 'Not authorized to view this resource.' });
      _this.db.User.findAll({
        include: [ "Role" ], order: [['name', 'ASC']]
      }).then((users) => {
        return res.status(200).json({ success: true, response: users });
      });
    });
  }

  delete(req, res) {
    super.isAuthorized('user.delete', req.user.user_id, function(authorized) {
      if (!authorized) return res.status(403).json({ success: false, message: 'Not authorized to view this resource.' });
      Crud.delete({ classname: 'User', db: _this.db, req: req, res: res });
    });
  }
}

function validateUser(user, res, err) {
  if (user) {
    return res.status(201).json({success: true, message: 'Account updated successfully.' });
  } else {
    return res.status(500).json({success: false, errors: [{ type: 'user.create.unspecified', message: 'An error occurred creating the account. See validations for details.', validations: err }]});
  }
}



module.exports = User;
