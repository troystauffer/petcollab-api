class ScheduleItemRoutes {
  constructor(router, args) {
    const schedule_item = new (require('./schedule_item'))(args);
    const authorized = args['authorized'];
    router.get('/schedules/:id/schedule_items', authorized(['admin']), schedule_item.list);
    router.get('/schedule_items/:id', authorized(['admin']), schedule_item.detail);
    router.post('/schedules/:id/schedule_items', authorized(['admin']), schedule_item.create);
    router.post('/schedule_items/:id', authorized(['admin']), schedule_item.update);
    router.delete('/schedule_items/:id', authorized(['admin']), schedule_item.delete);
  }
}

module.exports = ScheduleItemRoutes;