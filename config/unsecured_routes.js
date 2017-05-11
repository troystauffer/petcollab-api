'use strict';

function unsecuredRoutes(apiPrefix) {
  return [
    { url: apiPrefix + '/auth', methods: ['POST'] },
    { url: apiPrefix + '/auth/facebook', methods: ['POST'] },
    { url: apiPrefix + '/user/error', methods: ['GET'] },
    { url: apiPrefix + '/user/fields', methods: ['GET'] },
    { url: apiPrefix + '/user', methods: ['POST'] },
    { url: apiPrefix + '/user/confirm', methods: ['POST'] }
  ];
}

module.exports = unsecuredRoutes;