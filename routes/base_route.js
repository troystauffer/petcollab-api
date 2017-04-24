import RO from '../lib/response_object';
import ApiError from '../lib/api_error';
let _this = {};

class BaseRoute {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  isAuthorized(roles) {
    let hasRole = this.hasRole;
    return function(req, res, next) {
      hasRole(req.user, roles, function(result) {
        if (result) {
          next();
        } else {
          _this.log.info('Access denied for user ' + req.user.user_id);
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'user.not_authorized', message: 'User is not authorized to view or modify the specified resource.'})]}));
        }
      })
    }
  }

  hasRole(user, roles, cb) {
    if (roles.includes('any')) { return cb(true); }
    if (user && user.user_id) {
      _this.db.User.findById(user.user_id, { include: [ _this.db.Role ]})
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