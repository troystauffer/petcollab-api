import BaseRoute from '../base_route';

let _this = {};

class Schedule extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.list({ classname: 'Schedule', foreignKeyClassname: 'event', foreignKeyValue: req.params.event_id,
      res: res });
  }

  detail(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.detail({ classname: 'Schedule', req: req, res: res });
  }

  create(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Event.findByPk(req.params.event_id).then((event) => {
      if (!event) return res.status(404).json({ success: false, errors: [{
        type: 'schedule.create.not_found',
        message: 'No event found for provided id.'
      }]});
      _this.db.Schedule.create({
        event_id: event.id,
        title: req.body.title
      }).then((schedule) => {
        _this.log.info('Created schedule for event ' + req.params.event_id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Schedule created successfully.',
          response: { schedule }});
      });
    });
  }

  update(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Schedule.findByPk(req.params.schedule_id).then((schedule) => {
      if (!schedule) return res.status(404).json({ success: false, errors: [{
        type: 'schedule.update.not_found',
        message: 'No schedule found for provided id.'
      }]});
      schedule.update({ title: req.body.title }).then(() => {
        _this.log.info('Updated schedule ' + req.params.schedule_id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Schedule updated successfully.' });
      });
    });
  }

  delete(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.delete({ classname: 'Schedule', req: req, res: res });
  }
}

module.exports = Schedule;
