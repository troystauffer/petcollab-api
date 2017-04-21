class EventRoutes {
  constructor(router, args) {
    const event = new (require('./event'))(args);
    router.get('/events', event.isAuthorized(['any']), event.events);
    router.get('/events/:event_id', event.isAuthorized(['any']), event.event);
    router.post('/events', event.isAuthorized(['super_admin', 'admin']), event.create);
    router.post('/events/:event_id', event.isAuthorized(['super_admin', 'admin']), event.update);
    router.delete('/events/:event_id', event.isAuthorized(['super_admin', 'admin']), event.delete);
  }
}

module.exports = EventRoutes;