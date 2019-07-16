import { check, sanitizeBody } from 'express-validator';

class EventRoutes {
  constructor(router, args) {
    const event = new (require('./event'))(args);
    router.get('/events.:format?', event.list);
    router.get('/events/:event_id.:format?', [
      check('event_id').not().isEmpty().withMessage('An event id is required.')
    ], event.detail);
    router.post('/events.:format?', [
      check('title').not().isEmpty().withMessage('Title is required.'),
      check('starts_at').not().isEmpty().withMessage('Start date is required.'),
      check('ends_at').not().isEmpty().withMessage('End date is required.'),
      sanitizeBody('starts_at').toDate(),
      sanitizeBody('ends_at').toDate(),
      sanitizeBody('owner_user_id').toInt(),
      sanitizeBody('releasing_rescue_id').toInt(),
      sanitizeBody('receiving_rescue_id').toInt()
    ], event.create);
    router.patch('/events/:event_id.:format?', [
      check('event_id').not().isEmpty().withMessage('An event id is required.'),
      check('title').not().isEmpty().withMessage('Title is required.'),
      check('starts_at').not().isEmpty().withMessage('Start date is required.'),
      check('ends_at').not().isEmpty().withMessage('End date is required.'),
      sanitizeBody('starts_at').toDate(),
      sanitizeBody('ends_at').toDate(),
      sanitizeBody('owner_user_id').toInt(),
      sanitizeBody('releasing_rescue_id').toInt(),
      sanitizeBody('receiving_rescue_id').toInt()
    ], event.update);
    router.delete('/events/:event_id.:format?', [
      check('event_id').not().isEmpty().withMessage('An event id is required.')
    ], event.delete);
  }
}

module.exports = EventRoutes;
