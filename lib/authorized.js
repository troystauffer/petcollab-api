module.exports = function(jwt, key) {
  let authorized = function(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, key, function(err, user) {
        if (err) return res.status(400).json({ message: 'Unable to decrypt token.', errors: err });
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({ message: 'No authentication token provided.' });
    }
  };
  authorized.unless = require('express-unless');
  return authorized;  
}

