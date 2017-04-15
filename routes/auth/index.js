class AuthRoutes {
  constructor(router, args) {
    const auth = new (require('./auth'))(args);
    router.post('/auth', auth.auth);
    router.post('/auth/facebook', auth.facebook);
  }
}

module.exports = AuthRoutes;