class UserRoutes {
  constructor(router, args) {
    const user = new (require('./user'))(args);
    router.get('/users/info.:format?', user.info);
    router.get('/users/error.:format?', user.error);
    router.post('/users.:format?', user.createUser);
    router.post('/users/confirm.:format?', user.confirm);
    router.patch('/users.:format?', user.update);
    router.get('/admin/users.:format?', user.list);
  }
}

module.exports = UserRoutes;
