class EventRoutes {
  constructor(router, args) {
    const event = new (require('./event'))(args);
    router.get('/events', event.isAuthorized(['admin']), event.events);
    router.get('/events/:event_id', event.isAuthorized(['admin']), event.event);
    router.post('/events', event.isAuthorized(['admin']), event.create);
    router.post('/events/:event_id', event.isAuthorized(['admin']), event.update);
    router.delete('/events/:event_id', event.isAuthorized(['admin']), event.delete);
  }
}

module.exports = EventRoutes;