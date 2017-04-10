import RO from '../../lib/response_object';

const _ = require('lodash');
let _this = {};

let User = function(args = {}) {
  Object.keys(args).map((key) => { _this[key] = args[key]; });
}

User.prototype.create = function(req, res) {
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Email must be a valid email address.').isEmail();
  req.checkBody('password', 'A valid password is required.').notEmpty();
  req.checkBody('name', 'A valid name is required.').notEmpty();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json(new RO({success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
  _this.pwcrypt.secureHash(req.body.password, function( err, passwordHash, salt ) {
    if (err) return res.status(500).json(new RO({success: false, message: 'An error occurred.', errors: err }).obj());
    _this.db.User.findOrCreate({ where: { email: req.body.email }})
    .spread(function(user, created) {
      if (!created) return res.status(400).json(new RO({success: false, message: 'User with this email already exists.'}).obj());
      user.password_hash = passwordHash;
      user.salt = salt;
      user.name = req.body.name;
      _this.UserToken.generateToken(_this.config.confirmationTokenLength, function(token) {
        _this.log.info('Confirmation token generated for user ' + user.email + ': ' + token);
        user.confirmation_token = token;
        user.save()
        .then(function(user) {
          if (user) {
            return res.status(201).json(new RO({success: true, message: 'Account created successfully.' }).obj());
          } else {
            return res.status(500).json(new RO({success: false, message: 'An error occurred creating the account.', errors: err }).obj());
          }
        });
      });
    });
  });
};

User.prototype.info = function(req, res) {
  return res.status(200).json(new RO({success: true, response: {user: req.user}}).obj());
};

User.prototype.error = function(req, res) {
  return res.status(400).json(new RO({success: false, message: 'An error occurred.' }).obj());
};

User.prototype.fields = function(req, res) {
  _this.db.User.describe().then(function(table) {
    var obj = _.omit(table, ["id", "facebook_id", "createdAt", "updatedAt", "password_hash", "salt", "confirmed"]);
    obj["password"] = { "type": "password", "allowNull": false, "primaryKey": false };
    return res.json(new RO({success: true, response: obj}).obj());
  });
};

User.prototype.confirm = function(req, res) {
  req.checkBody('confirmation_token', 'A valid confirmation token is required.').notEmpty().isAlphanumeric().isLength(_this.config.confirmationTokenLength);
  req.checkBody('email', 'A valid email is required.').notEmpty().isEmail();
  let errors = req.validationErrors();
  if (errors) return res.status(400).json(new RO({success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
  _this.db.User.findOne({ where: { email: req.body.email, confirmation_token: req.body.confirmation_token }})
  .then(function(user) {
    if (user) {
      user.confirmed = Date();
      user.confirmation_token = null;
      user.save()
      .then(function(user) {
        if (user) {
          return res.status(200).json(new RO({success: true, message: 'Confirmation successful.' }).obj());
        } else {
          return res.status(500).json(new RO({success: false, message: 'An error occurred redeeming the token.' }).obj());
        }
      })
    } else {
      return res.status(400).json(new RO({success: false, message: 'Email or token are invalid.' }).obj());
    }
  })
};

module.exports = User;