class UserRoutes {
  constructor(router, args) {
    const user = new (require('./user'))(args);
    router.get('/user', user.info);
    router.get('/user/error', user.error);
    router.post('/user', user.createUser);
    router.post('/user/confirm', user.confirm);
    router.post('/admin/user', user.isAuthorized(['super_admin']), user.createAdmin);
    router.patch('/user', user.update);
  }
}

module.exports = UserRoutes;