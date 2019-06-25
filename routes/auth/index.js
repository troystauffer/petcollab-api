class AuthRoutes {
  constructor(router, args) {
    const auth = new (require('./auth'))(args);
    router.post('/auth', auth.authenticate);
  }
}

module.exports = AuthRoutes;