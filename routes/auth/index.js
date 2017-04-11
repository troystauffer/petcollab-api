'use strict';
const path = require('path');

module.exports = function(router, args) {
  const auth = new (require(path.join(__dirname, 'auth')))(args);
  router.post('/auth', auth.auth);
  router.post('/auth/facebook', auth.facebook);
};