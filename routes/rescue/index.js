class RescueRoutes {
  constructor(router, args) {
    const rescue = new (require('./rescue'))(args);
    router.get('/rescues', rescue.isAuthorized(['admin', 'super_admin']), rescue.list);
    router.post('/rescues', rescue.isAuthorized(['admin', 'super_admin']), rescue.create);
  }
}

module.exports = RescueRoutes;