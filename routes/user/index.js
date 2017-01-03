'use strict';
const path = require('path');

module.exports = function(router, db, pwcrypt, log) {
  const user = new (require(path.join(__dirname, 'user')))(db, pwcrypt, log);
  router.get('/user', user.info);
  router.get('/user/error', user.error);
  router.post('/user/create', user.create);
  router.get('/user/fields', user.fields);
};