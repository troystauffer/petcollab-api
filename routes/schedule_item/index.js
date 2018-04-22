class ScheduleItemRoutes {
  constructor(router, args) {
    const schedule_item = new (require('./schedule_item'))(args);
    router.get('/schedules/:schedule_id/schedule_items', schedule_item.list);
    router.get('/schedule_items/:schedule_item_id', schedule_item.detail);
    router.post('/schedules/:schedule_id/schedule_items', schedule_item.create);
    router.patch('/schedule_items/:schedule_item_id', schedule_item.update);
    router.delete('/schedule_items/:schedule_item_id', schedule_item.delete);
  }
}

module.exports = ScheduleItemRoutes;
