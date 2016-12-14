'use strict';

function unsecuredRoutes() {
  return [
    '/v1/auth/facebook',
    '/v1/test'
  ];
}

module.exports = new unsecuredRoutes();