module.exports = function(jws, config) {
  let authenticated = function(req, res, next) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      if (jws.verify(token, config.algorithm, config.key)) {
        const user = jws.decode(token);
        req.user = JSON.parse(user.payload);
      } else {
        return res.status(400).json({ message: 'Unable to decrypt token.', errors: err });
      }
    } else {
      return res.status(403).json({ message: 'No authentication token provided.' });
    }
    next();
  };
  authenticated.unless = require('express-unless');
  return authenticated;  
}