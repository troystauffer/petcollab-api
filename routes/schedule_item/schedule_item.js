import RO from '../../lib/response_object';

let _this = {};

class ScheduleItem {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    req.checkParams('id', 'A schedule id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.ScheduleItem.findAll({ where: { schedule_id: req.params.id }})
    .then((items) => {
      return res.status(200).json(new RO({ success: true, response: { schedule_items: items }}).obj());
    });
  }

  detail(req, res) {
    req.checkParams('id', 'A schedule_item id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.ScheduleItem.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(404).json(new RO({ success: false, message: 'No schedule_item found for provided id.'}).obj());
      return res.status(200).json(new RO({ success: true, response: { id: item.id, title: item.title, schedule_id: item.schedule_id, assigned_user_id: item.assigned_user_id, starts_at: item.starts_at, ends_at: item.ends_at, order: item.order }}).obj());
    });
  }

  create(req, res) {
    req.checkParams('id', 'A schedule id is required.').notEmpty().isNumeric();
    req.checkBody('assigned_user_id', 'User id must be numeric').isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    _this.db.Schedule.findById(req.params.id).then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, message: 'Invalid schedule id.' }).obj());
      _this.db.ScheduleItem.create({
        schedule_id: schedule.id,
        assigned_user_id: req.body.assigned_user_id || null,
        title: req.body.title || null,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        order: req.body.order || null
      }).then((item) => {
        return res.status(201).json(new RO({ success: true, message: 'Schedule item created successfully.', response: { id: schedule.id }}).obj());
      });
    });
  }

  update(req, res) {
    req.checkParams('id', 'A schedule item id is required.').notEmpty().isNumeric();
    req.checkBody('assigned_user_id', 'User id must be numeric').isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    _this.db.ScheduleItem.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(404).json(new RO({ success: false, message: 'No schedule item found for provided id.'}).obj());
      item.update({
        assigned_user_id: req.body.assigned_user_id || null,
        title: req.body.title || null,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        order: req.body.order || null
      }).then((schedule) => {
        return res.status(201).json(new RO({ success: true, message: 'Schedule item updated successfully.' }).obj());
      });
    });
  }

  delete(req, res) {
    req.checkParams('id', 'A schedule item id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.ScheduleItem.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(404).json(new RO({ success: false, message: 'No schedule item found for provided id.'}).obj());
      item.destroy();
      return res.status(200).json(new RO({ success: true, message: 'Schedule item deleted.' }).obj());
    });
  }
}

module.exports = ScheduleItem;