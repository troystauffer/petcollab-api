'use strict';
const path = require('path');

module.exports = function(router, passport, db, log) {
  const user = new (require(path.join(__dirname, 'user')))(passport, db, log);

  router.get('/user/info', user.info);
};