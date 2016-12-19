'use strict';

function unsecuredRoutes() {
  return [
    '/v1/auth',
    '/v1/user/error'
  ];
}

module.exports = new unsecuredRoutes();