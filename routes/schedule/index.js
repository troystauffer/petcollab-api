class ScheduleRoutes {
  constructor(router, args) {
    const schedule = new (require('./schedule'))(args);
    router.post('/events/:event_id/schedules', schedule.isAuthorized(['admin']), schedule.create);
    router.get('/events/:event_id/schedules', schedule.isAuthorized(['admin']), schedule.schedules);
    router.get('/schedules/:schedule_id', schedule.isAuthorized(['admin']), schedule.schedule);
    router.post('/schedules/:schedule_id', schedule.isAuthorized(['admin']), schedule.update);
    router.delete('/schedules/:schedule_id', schedule.isAuthorized(['admin']), schedule.delete);
  }
}

module.exports = ScheduleRoutes;