class ScheduleRoutes {
  constructor(router, args) {
    const schedule = new (require('./schedule'))(args);
    router.post('/events/:event_id/schedules', schedule.create);
    router.get('/events/:event_id/schedules', schedule.list);
    router.get('/schedules/:schedule_id', schedule.detail);
    router.patch('/schedules/:schedule_id', schedule.update);
    router.delete('/schedules/:schedule_id', schedule.delete);
  }
}

module.exports = ScheduleRoutes;
