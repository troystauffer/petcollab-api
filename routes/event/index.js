class EventRoutes {
  constructor(router, args) {
    const event = new (require('./event'))(args);
    router.get('/events.:format?', event.list);
    router.get('/events/:event_id.:format?', event.detail);
    router.post('/events.:format?',  event.create);
    router.patch('/events/:event_id.:format?', event.update);
    router.delete('/events/:event_id.:format?', event.delete);
  }
}

module.exports = EventRoutes;
