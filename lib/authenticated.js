module.exports = function(jws, config, encryption, log) {
  let authenticated = function(req, res, next) {
    let encryptedToken = req.body.token || req.query.token || req.headers['x-access-token'];
    let token = encryption.decrypt(encryptedToken);
    if (token) {
      if (jws.verify(token, config.algorithm, config.key)) {
        const user = jws.decode(token);
        req.user = JSON.parse(user.payload);
        log.info('User ' + req.user.email + ', user_id: ' + req.user.user_id + ' authenticated.');
      } else {
        log.info('Unable to decrypt token: ' + token);
        return res.status(400).json({ message: 'Unable to decrypt token.' });
      }
    } else {
      return res.status(403).json({ message: 'Unable to decrypt token.' });
    }
    next();
  };
  authenticated.unless = require('express-unless');
  return authenticated;
};
