class UserRoutes {
  constructor(router, args) {
    const user = new (require('./user'))(args);
    router.get('/user', user.info);
    router.get('/user/error', user.error);
    router.post('/user', user.create);
    router.get('/user/fields', user.fields);
    router.post('/user/confirm', user.confirm);
  }
}

module.exports = UserRoutes;