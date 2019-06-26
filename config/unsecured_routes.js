'use strict';

function unsecuredRoutes(apiPrefix) {
  return [
    { url: apiPrefix + '/auth', methods: ['POST'] },
    { url: apiPrefix + '/users', methods: ['POST'] },
    { url: apiPrefix + '/users/create/admin', methods: ['POST'] },
    { url: apiPrefix + '/users/error', methods: ['GET'] },
    { url: apiPrefix + '/users/confirm', methods: ['POST'] }
  ];
}

module.exports = unsecuredRoutes;
