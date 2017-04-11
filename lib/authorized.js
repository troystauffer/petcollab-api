const RO = require('./response_object');

module.exports = function(db) {
  let authorized = function(acceptableRoles) {
    return function(req, res, next) {
      if (req.user) {
        db.User.findById(req.user.user_id)
        .then((user) => {
          if (user) {
            user.getRole().then(function(role) {
              if (!role || !acceptableRoles.includes(role.title)) {
                  res.status(403).json(new RO({ success: false, message: 'User not authorized.' }).obj());
              } else {
                next();
              }
            })
          } else {
            res.status(403).json(new RO({ success: false, message: 'Invalid token.' }).obj());
          }
        })
      }
    }
  }
  return authorized;
}