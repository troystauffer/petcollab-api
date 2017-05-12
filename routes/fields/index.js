class FieldsRoutes {
  constructor(router, args) {
    const fields = new (require('./fields'))(args);
    router.get('/fields/event', fields.event);
    router.get('/fields/user', fields.user);
  }
}

module.exports = FieldsRoutes;