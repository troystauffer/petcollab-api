import RO from '../lib/response_object';
import ApiError from '../lib/api_error';
let _this = {};

class BaseRoute {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  isAuthorized() { return function(req, res, next) { next(); }}

  hasRole(user, roles, cb) {
    if (roles.includes('any')) { return cb(true); }
    if (user && user.user_id) {
      _this.db.User.findById(user.user_id)
      .then((user) => {
        if (user) {
          user.getRole().then(function(role) {
            if (role && roles.includes(role.title)) {
              cb(true);
            } else {
              cb(false);
            }
          })
        } else {
          cb(false);
        }
      })
    } else {
      cb(false);
    }
  }

  validationErrorResponse(res, errors) {
    return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [new ApiError({ type: 'api.params.invalid', validation: errors })]}));
  }
}

module.exports = BaseRoute;