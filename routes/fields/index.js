class FieldsRoutes {
  constructor(router, args) {
    const fields = new (require('./fields'))(args);
    router.get('/fields/event.:format?', fields.event);
    router.get('/fields/user.:format?', fields.user);
  }
}

module.exports = FieldsRoutes;