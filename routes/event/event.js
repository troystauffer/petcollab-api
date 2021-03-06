import BaseRoute from '../base_route';

let _this = {};

class Event extends BaseRoute{
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
    _this.hasRole = super.hasRole;
  }

  list(req, res) {
    _this.db.Event.findAll({ order: [['starts_at', 'DESC']], include: [_this.db.User]}).then((events) => {
      _this.log.info('Listing all events for user ' + req.user.email);
      return res.status(200).json({ success: true, response: { events }});
    });
  }

  detail(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Event.findByPk(req.params.event_id, { include: [
      { model: _this.db.Transfer, include: [_this.db.Pet]},
      { model: _this.db.Rescue, as:'ReleasingRescue' },
      { model: _this.db.Rescue, as:'ReceivingRescue' },
      _this.db.User
    ]}).then((event) => {
      if (!event) return res.status(404).json({ success: false, errors: [
        { type: 'event.detail.not_found', message: 'No event found for provided id.' }
      ]});
      _this.log.info('Detailing event ' + req.params.event_id + ' for user ' + req.user.email);
      return res.status(200).json({ success: true, response: { event }});
    });
  }

  create(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    if (!req.body.starts_at) return res.status(400).json({ success: false, errors: [
      { type: 'event.create.starts_at.invalid', message: 'Invalid start date.' }
    ]});
    if (!req.body.ends_at) return res.status(400).json({ success: false, errors: [
      { type: 'event.create.ends_at.invalid', message: 'Invalid end date.' }
    ]});
    if (!req.body.owner_user_id) req.body.owner_user_id = req.user.user_id;
    let eventParams = {
      title: req.body.title,
      starts_at: req.body.starts_at,
      ends_at: req.body.ends_at
    };
    if (req.body.owner_user_id) eventParams['owner_user_id'] = req.body.owner_user_id;
    if (req.body.releasing_rescue_id) eventParams['releasing_rescue_id'] = req.body.releasing_rescue_id;
    if (req.body.receiving_rescue_id) eventParams['receiving_rescue_id'] = req.body.receiving_rescue_id;
    _this.db.Event.create(eventParams).then((event) => {
      _this.log.info('Created new event ' + event.title + ', id: ' + event.id + ' for user ' + req.user.email);
      return res.status(201).json({ success: true, message: 'Event created successfully.', response: { event }});
    });
  }

  update(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    if (!req.body.starts_at) return res.status(400).json({ success: false, errors: [
      { type: 'event.update.starts_at.invalid', message: 'Invalid start date.' }
    ]});
    if (!req.body.ends_at) return res.status(400).json({ success: false, errors: [
      { type: 'event.update.ends_at.invalid', message: 'Invalid end date.' }
    ]});
    _this.db.Event.findByPk(req.params.event_id).then((event) => {
      if (!event) return res.status(404).json({ success: false, errors: [
        { type: 'event.update.not_found', message: 'No event found for provided id.' }
      ]});
      if (!req.body.releasing_rescue_id) req.body.releasing_rescue_id = event.releasing_rescue_id;
      if (!req.body.receiving_rescue_id) req.body.receiving_rescue_id = event.receiving_rescue_id;
      event.update({
        title: req.body.title,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        releasing_rescue_id: req.body.releasing_rescue_id,
        receiving_rescue_id: req.body.receiving_rescue_id
      }).then((event) => {
        _this.log.info('Updated event ' + event.title + ', id: ' + event.id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Event updated successfully.' });
      });
    });
  }

  delete(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.delete({ classname: 'Event', req: req, res: res });
  }
}

module.exports = Event;
