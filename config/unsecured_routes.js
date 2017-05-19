'use strict';

function unsecuredRoutes(apiPrefix) {
  let fieldsRegex = new RegExp('^' + apiPrefix + '\/fields\/[a-zA-Z]*\.?[a-zA-Z]*');
  return [
    { url: apiPrefix + '/auth', methods: ['POST'] },
    { url: apiPrefix + '/auth/facebook', methods: ['POST'] },
    { url: apiPrefix + '/user/error', methods: ['GET'] },
    { url: fieldsRegex, methods: ['GET'] },
    { url: apiPrefix + '/user', methods: ['POST'] },
    { url: apiPrefix + '/user/confirm', methods: ['POST'] }
  ];
}

module.exports = unsecuredRoutes;