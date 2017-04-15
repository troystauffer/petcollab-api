class ScheduleRoutes {
  constructor(router, args) {
    const schedule = new (require('./schedule'))(args);
    const authorized = args['authorized'];
    router.post('/events/:id/schedules', authorized(['admin']), schedule.create);
    router.get('/events/:id/schedules', authorized(['admin']), schedule.schedules);
    router.get('/schedules/:id', authorized(['admin']), schedule.schedule);
    router.post('/schedules/:id', authorized(['admin']), schedule.update);
    router.delete('/schedules/:id', authorized(['admin']), schedule.delete);
  }
}

module.exports = ScheduleRoutes;