let _this = {};

class BaseRoute {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  isAuthorized() { return function(req, res, next) { next(); }}

  hasRole(user, roles, cb) {
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
}

module.exports = BaseRoute;