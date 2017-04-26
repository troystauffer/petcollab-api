class RescueRoutes {
  constructor(router, args) {
    const rescue = new (require('./rescue'))(args);
    router.get('/rescues', rescue.isAuthorized(['admin', 'super_admin']), rescue.list);
    router.get('/rescues/:rescue_id', rescue.isAuthorized(['admin', 'super_admin']), rescue.detail);
    router.post('/rescues', rescue.isAuthorized(['admin', 'super_admin']), rescue.create);
    router.post('/rescues/:rescue_id', rescue.isAuthorized(['admin', 'super_admin']), rescue.update);
    router.delete('/rescues/:rescue_id', rescue.isAuthorized(['admin', 'super_admin']), rescue.delete);
  }
}

module.exports = RescueRoutes;