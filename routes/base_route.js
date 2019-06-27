import _ from 'lodash';
let _this = {};

class BaseRoute {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  validationErrorResponse(res, errors) {
    return res.status(400).json({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [{ type: 'api.params.invalid', validation: errors }]});
  }

  isAuthorized(route, user_id, callback) {
    if (!_.includes(['user.list'], route)) return callback(true);
    _this.db.User.findByPk(user_id).then((user) => {
      if (!user) return callback(false);
      user.isSuperAdmin(function(is) {
        return callback(is);
      });
    });
  }
}

module.exports = BaseRoute;
