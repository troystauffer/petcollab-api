import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';

let _this = {};

class User extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
    _this.create = this.create;
    _this.db.Role.findOne({ where: { title: 'user' }})
    .then((role) => {
      _this.userRole = role;
    });
  }

  createAdmin(req, res) {
    return _this.create(req, res, _this.adminRole);
  }

  createUser(req, res) {
    return _this.create(req, res, _this.userRole);
  }

  info(req, res) {
    return res.status(200).json(new RO({success: true, response: {user: req.user}}));
  }

  error(req, res) {
    return res.status(400).json(new RO({success: false, errors: [new ApiError({ type: 'user.error', message: 'An error occurred.' })]}));
  }

  fields(req, res) {
    _this.db.User.describe().then(function(table) {
      let fields = _.omit(table, ["id", "facebook_id", "createdAt", "updatedAt", "password_hash", "salt", "confirmed"]);
      fields["password"] = { "type": "password", "allowNull": false, "primaryKey": false };
      return res.json(new RO({success: true, response: {fields}}));
    });
  }

  confirm(req, res) {
    req.checkBody('confirmation_token', 'A valid confirmation token is required.').notEmpty().isAlphanumeric().isLength(_this.config.confirmationTokenLength);
    req.checkBody('email', 'A valid email is required.').notEmpty().isEmail();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.User.findOne({ where: { email: req.body.email, confirmation_token: req.body.confirmation_token }})
    .then(function(user) {
      if (user) {
        user.confirmed = Date();
        user.confirmation_token = null;
        user.save()
        .then(function(user) {
          if (user) {
            return res.status(200).json(new RO({success: true, message: 'Confirmation successful.' }));
          } else {
            return res.status(500).json(new RO({success: false, errors: [new ApiError({ type: 'user.confirm.token_error', message: 'An error occurred redeeming the token.' })]}));
          }
        })
      } else {
        return res.status(400).json(new RO({success: false, errors: [new ApiError({ type: 'user.confirm.params.invalid', message: 'Email or token are invalid.' })]}));
      }
    })
  }

  create(req, res, role) {
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email must be a valid email address.').isEmail();
    req.checkBody('password', 'A valid password is required.').notEmpty();
    req.checkBody('name', 'A valid name is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.pwcrypt.secureHash(req.body.password, function( err, passwordHash, salt ) {
      if (err) return res.status(500).json(new RO({success: false, errors: [new ApiError({ type: 'user.create.unspecified', message: 'An error occurred. See validations for details.', validations: err })]}));
      _this.db.User.findOrCreate({ where: { email: req.body.email }})
      .spread(function(user, created) {
        if (!created) return res.status(400).json(new RO({success: false, errors: [new ApiError({ type: 'user.create.email.exists', message: 'User with this email already exists.'})]}));
        user.password_hash = passwordHash;
        user.salt = salt;
        user.name = req.body.name;
        _this.UserToken.generateToken(_this.config.confirmationTokenLength, function(token) {
          _this.log.info('Confirmation token generated for user ' + user.email + ': ' + token);
          user.confirmation_token = token;
          user.setRole(role);
          user.save()
          .then(function(user) {
            if (user) {
              return res.status(201).json(new RO({success: true, message: 'Account created successfully.' }));
            } else {
              return res.status(500).json(new RO({success: false, errors: [new ApiError({ type: 'user.create.unspecified', message: 'An error occurred creating the account. See validations for details.', validations: err })]}));
            }
          });
        });
      });
    });
  }

  isAuthorized(roles) {
    let hasRole = super.hasRole;
    return function(req, res, next) {
      hasRole(req.user, roles, function(result) {
        if (result) {
          next();
        } else {
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'user.user.not_authorized', message: 'User not authorized.' })]}));
        }
      });
    }
  }
}

module.exports = User;