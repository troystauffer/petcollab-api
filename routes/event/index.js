class EventRoutes {
  constructor(router, args) {
    const event = new (require('./event'))(args);
    router.get('/events.:format?', event.isAuthorized(['any']), event.list);
    router.get('/events/:event_id.:format?', event.isAuthorized(['any']), event.detail);
    router.post('/events.:format?', event.isAuthorized(['super_admin', 'admin']), event.create);
    router.post('/events/:event_id.:format?', event.isAuthorized(['super_admin', 'admin']), event.update);
    router.delete('/events/:event_id.:format?', event.isAuthorized(['super_admin', 'admin']), event.delete);
  }
}

module.exports = EventRoutes;