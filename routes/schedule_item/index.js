import { check, sanitizeBody } from 'express-validator';

class ScheduleItemRoutes {
  constructor(router, args) {
    const schedule_item = new (require('./schedule_item'))(args);
    router.get('/schedules/:schedule_id/schedule_items', [
      check('schedule_id').isNumeric().withMessage('A schedule id is required.')
    ], schedule_item.list);
    router.get('/schedule_items/:schedule_item_id', [
      check('schedule_id').isNumeric().withMessage('A schedule id is required.')
    ], schedule_item.detail);
    router.post('/schedules/:schedule_id/schedule_items', [
      check('schedule_id').isNumeric().withMessage('A schedule id is required.'),
      check('assigned_user_id').isNumeric().withMessage('User id must be numeric'),
      sanitizeBody('starts_at').toDate(),
      sanitizeBody('ends_at').toDate()
    ], schedule_item.create);
    router.patch('/schedule_items/:schedule_item_id', [
      check('schedule_item_id').isNumeric().withMessage('A schedule item id is required.'),
      sanitizeBody('starts_at').toDate(),
      sanitizeBody('ends_at').toDate(),
      sanitizeBody('checked_in_at').toDate()
    ], schedule_item.update);
    router.delete('/schedule_items/:schedule_item_id', [
      check('schedule_item_id').isNumeric().withMessage('A schedule item id is required.')
    ], schedule_item.delete);
  }
}

module.exports = ScheduleItemRoutes;
