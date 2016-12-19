'use strict';
const path = require('path');

module.exports = function(router, db, pwcrypt, jwt, config, log) {
  const auth = new (require(path.join(__dirname, 'auth')))( db, pwcrypt, jwt, config, log);

  router.post('/auth', auth.auth);
};