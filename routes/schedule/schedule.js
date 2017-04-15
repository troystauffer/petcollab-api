import RO from '../../lib/response_object';

let _this = {};

class Schedule {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  schedules(req, res) {
    req.checkParams('id', 'An event id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Schedule.findAll({ where: { event_id: req.params.id }})
    .then((schedules) => {
      return res.status(200).json(new RO({ success: true, response: { schedules }}).obj());
    });
  }

  schedule(req, res) {
    req.checkParams('id', 'A schedule id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Schedule.findById(req.params.id)
    .then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, message: 'No schedule found for provided id.'}).obj());
      return res.status(200).json(new RO({ success: true, response: { id: schedule.id, event_id: schedule.event_id, title: schedule.title }}).obj());
    });
  }

  create(req, res) {
    req.checkParams('id', 'An event id is required.').notEmpty().isNumeric();
    req.checkBody('title', 'Title is required.').notEmpty();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Event.findById(req.params.id).then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, message: 'Invalid event id.' }).obj());
      _this.db.Schedule.create({
        event_id: event.id,
        title: req.body.title
      }).then((schedule) => {
        return res.status(201).json(new RO({ success: true, message: 'Schedule created successfully.', response: { id: schedule.id }}).obj());
      });
    });
  }

  update(req, res) {
    req.checkParams('id', 'A schedule id is required.').notEmpty().isNumeric();
    req.checkBody('title', 'Title is required.').notEmpty();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Schedule.findById(req.params.id)
    .then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, message: 'No schedule found for provided id.'}).obj());
      schedule.update({
        title: req.body.title,
      }).then((schedule) => {
        return res.status(201).json(new RO({ success: true, message: 'Schedule updated successfully.' }).obj());
      });
    });
  }

  delete(req, res) {
    req.checkParams('id', 'A schedule id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Schedule.findById(req.params.id)
    .then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, message: 'No schedule found for provided id.'}).obj());
      schedule.destroy();
      return res.status(200).json(new RO({ success: true, message: 'Schedule deleted.' }).obj());
    });
  }
}

module.exports = Schedule;