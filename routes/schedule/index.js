class ScheduleRoutes {
  constructor(router, args) {
    const schedule = new (require('./schedule'))(args);
    router.post('/events/:event_id/schedules', schedule.isAuthorized(['admin', 'super_admin']), schedule.create);
    router.get('/events/:event_id/schedules', schedule.isAuthorized(['any']), schedule.schedules);
    router.get('/schedules/:schedule_id', schedule.isAuthorized(['any']), schedule.schedule);
    router.post('/schedules/:schedule_id', schedule.isAuthorized(['admin', 'super_admin']), schedule.update);
    router.delete('/schedules/:schedule_id', schedule.isAuthorized(['admin', 'super_admin']), schedule.delete);
  }
}

module.exports = ScheduleRoutes;