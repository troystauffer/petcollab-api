class RescueRoutes {
  constructor(router, args) {
    const rescue = new (require('./rescue'))(args);
    router.get('/rescues', rescue.list);
    router.get('/rescues/:rescue_id', rescue.detail);
    router.post('/rescues', rescue.create);
    router.patch('/rescues/:rescue_id', rescue.update);
    router.delete('/rescues/:rescue_id', rescue.delete);
  }
}

module.exports = RescueRoutes;
