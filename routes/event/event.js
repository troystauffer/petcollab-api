import RO from '../../lib/response_object';

let _this = {};

class Event {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  events(req, res) {
    _this.db.Event.findAll({ order: [['starts_at', 'DESC']] })
    .then((events) => {
      return res.status(200).json(new RO({ success: true, response: { events }}).obj());
    });
  }

  event(req, res) {
    req.checkParams('id', 'An event id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Event.findById(req.params.id)
    .then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, message: 'No event found for provided id.'}).obj());
      return res.status(200).json(new RO({ success: true, response: { id: event.id, title: event.title, starts_at: event.starts_at, ends_at: event.ends_at }}).obj());
    });
  }

  create(req, res) {
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('starts_at', 'Start date is required.').notEmpty();
    req.checkBody('ends_at', 'End date is required.').notEmpty();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    if (!req.body.starts_at) return res.status(400).json(new RO({ success: false, message: 'Invalid start date.' }).obj());
    if (!req.body.ends_at) return res.status(400).json(new RO({ success: false, message: 'Invalid end date.' }).obj());
    _this.db.Event.create({
      title: req.body.title,
      starts_at: req.body.starts_at,
      ends_at: req.body.ends_at
    }).then((event) => {
      return res.status(201).json(new RO({ success: true, message: 'Event created successfully.', response: { id: event.id }}).obj());
    })
  }

  update(req, res) {
    req.checkParams('id', 'An event id is required.').notEmpty().isNumeric();
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('starts_at', 'Start date is required.').notEmpty();
    req.checkBody('ends_at', 'End date is required.').notEmpty();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    if (!req.body.starts_at) return res.status(400).json(new RO({ success: false, message: 'Invalid start date.' }).obj());
    if (!req.body.ends_at) return res.status(400).json(new RO({ success: false, message: 'Invalid end date.' }).obj());
    _this.db.Event.findById(req.params.id)
    .then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, message: 'No event found for provided id.'}).obj());
      event.update({
        title: req.body.title,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at
      }).then((event) => {
        return res.status(201).json(new RO({ success: true, message: 'Event updated successfully.' }).obj());
      });
    });
  }

  delete(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    let errors = req.validationErrors();
    if (errors) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: errors }).obj());
    _this.db.Event.findById(req.params.event_id)
    .then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, message: 'No event found for provided id.'}).obj());
      event.destroy();
      return res.status(200).json(new RO({ success: true, message: 'Event deleted.' }).obj());
    });
  }
}

module.exports = Event;