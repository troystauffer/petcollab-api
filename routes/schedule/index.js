import { check } from 'express-validator';

class ScheduleRoutes {
  constructor(router, args) {
    const schedule = new (require('./schedule'))(args);
    router.post('/events/:event_id/schedules', [
      check('event_id').not().isEmpty().withMessage('An event id is required.'),
      check('event_id').isNumeric().withMessage('An event id is required.')
    ], schedule.create);
    router.get('/events/:event_id/schedules', schedule.list);
    router.get('/schedules/:schedule_id', [
      check('schedule_id').isNumeric().withMessage('A schedule id is required.')
    ], schedule.detail);
    router.patch('/schedules/:schedule_id', [
      check('schedule_id').isNumeric().withMessage('A schedule id is required.'),
      check('title').not().isEmpty().withMessage('A schedule id is required.')
    ], schedule.update);
    router.delete('/schedules/:schedule_id', [
      check('schedule_id').isNumeric().withMessage('A schedule id is required.')
    ], schedule.delete);
  }
}

module.exports = ScheduleRoutes;
