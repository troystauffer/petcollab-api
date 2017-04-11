'use strict';
const path = require('path');

module.exports = function(router, args) {
  const user = new (require(path.join(__dirname, 'user')))(args);
  const authorized = args['authorized'];
  router.get('/user', authorized(['admin','user']), user.info);
  router.get('/user/error', user.error);
  router.post('/user', user.create);
  router.get('/user/fields', user.fields);
  router.post('/user/confirm', user.confirm);
};