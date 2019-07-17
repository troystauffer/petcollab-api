import BaseRoute from '../base_route';

let _this = {};

class ScheduleItem extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.list({ classname: 'ScheduleItem', foreignKeyClassname: 'Schedule',
      foreignKeyValue: req.params.schedule_id, res: res });
  }

  detail(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.detail({ classname: 'ScheduleItem', req: req, res: res });
  }

  create(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Schedule.findByPk(req.params.schedule_id).then((schedule) => {
      if (!schedule) return res.status(404).json({ success: false, errors: [{
        type: 'schedule_item.create.not_found',
        message: 'No schedule found for provided id.'
      }]});
      _this.db.ScheduleItem.create({
        schedule_id: schedule.id,
        assigned_user_id: req.body.assigned_user_id || null,
        title: req.body.title || null,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        order: req.body.order || null
      }).then((schedule_item) => {
        _this.log.info('Created schedule item ' + schedule_item.id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Schedule item created successfully.',
          response: { schedule_item }});
      });
    });
  }

  update(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.ScheduleItem.findByPk(req.params.schedule_item_id).then((item) => {
      if (!item) return res.status(404).json({ success: false, errors: [{
        type: 'schedule_item.update.not_found',
        message: 'No schedule_item found for provided id.'
      }]});
      let updateParams = {};
      if (req.body.assigned_user_id) updateParams['assigned_user_id'] = req.body.assigned_user_id;
      if (req.body.title) updateParams['title'] = req.body.title;
      if (req.body.starts_at) updateParams['starts_at'] = req.body.starts_at;
      if (req.body.ends_at) updateParams['ends_at'] = req.body.ends_at;
      if (req.body.order) updateParams['order'] = req.body.order;
      if (req.body.checked_in_at) updateParams['checked_in_at'] = req.body.checked_in_at;
      item.update(updateParams).then((item) => {
        _this.log.info('Updated schedule item ' + item.id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Schedule item updated successfully.' });
      });
    });
  }

  delete(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.delete({ classname: 'ScheduleItem', req: req, res: res });
  }
}

module.exports = ScheduleItem;
