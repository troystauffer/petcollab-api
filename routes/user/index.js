'use strict';
const path = require('path');

module.exports = function(router, db, pwcrypt, config, UserToken, log) {
  const user = new (require(path.join(__dirname, 'user')))(db, pwcrypt, config, UserToken, log);
  router.get('/user', user.info);
  router.get('/user/error', user.error);
  router.post('/user', user.create);
  router.get('/user/fields', user.fields);
  router.post('/user/confirm', user.confirm);
};