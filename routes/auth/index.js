'use strict';
const path = require('path');

module.exports = function(router, db, pwcrypt, jws, config, log) {
  const auth = new (require(path.join(__dirname, 'auth')))( db, pwcrypt, jws, config, log);

  router.post('/auth', auth.auth);
  router.post('/auth/facebook', auth.facebook);
};