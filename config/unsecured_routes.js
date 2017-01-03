'use strict';

function unsecuredRoutes(apiPrefix) {
  return [
    apiPrefix + '/auth',
    apiPrefix + '/auth/facebook',
    apiPrefix + '/user/error',
    apiPrefix + '/user/fields',
    apiPrefix + '/user/create'
  ];
}

module.exports = unsecuredRoutes;