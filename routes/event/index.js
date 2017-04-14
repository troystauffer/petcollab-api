'use strict';
const path = require('path');

module.exports = function(router, args) {
  const event = new (require(path.join(__dirname, 'event')))(args);
  const authorized = args['authorized'];
  router.get('/events', authorized(['admin']), event.events);
  router.get('/events/:id', authorized(['admin']), event.event);
  router.post('/events', authorized(['admin']), event.create);
  router.post('/events/:id', authorized(['admin']), event.update);
  router.delete('/events/:id', authorized(['admin']), event.delete);
};