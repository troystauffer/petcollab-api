import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';

let _this = {};

class Event extends BaseRoute{
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
    _this.hasRole = super.hasRole;
  }

  list(req, res) {
    _this.db.Event.findAll({ order: [['starts_at', 'DESC']] })
    .then((events) => {
      return res.status(200).json(new RO({ success: true, response: { events }}));
    });
  }

  detail(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Event.findById(req.params.event_id)
    .then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'event.detail.not_found', message: 'No event found for provided id.' })]}));
      return res.status(200).json(new RO({ success: true, response: { id: event.id, owner_user_id: event.owner_user_id, title: event.title, starts_at: event.starts_at, ends_at: event.ends_at }}));
    });
  }

  create(req, res) {
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('starts_at', 'Start date is required.').notEmpty();
    req.checkBody('ends_at', 'End date is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    req.sanitizeBody('owner_user_id').toInt();
    if (!req.body.starts_at) return res.status(400).json(new RO({ success: false, errors: [new ApiError({ type: 'event.create.starts_at.invalid', message: 'Invalid start date.' })]}));
    if (!req.body.ends_at) return res.status(400).json(new RO({ success: false, errors: [new ApiError({ type: 'event.create.ends_at.invalid', message: 'Invalid end date.' })]}));
    if (!req.body.owner_user_id) req.body.owner_user_id = req.user.user_id;
    _this.db.Event.create({
      title: req.body.title,
      starts_at: req.body.starts_at,
      ends_at: req.body.ends_at,
      owner_user_id: req.body.owner_user_id
    }).then((event) => {
      return res.status(201).json(new RO({ success: true, message: 'Event created successfully.', response: { id: event.id }}));
    })
  }

  update(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('starts_at', 'Start date is required.').notEmpty();
    req.checkBody('ends_at', 'End date is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    if (!req.body.starts_at) return res.status(400).json(new RO({ success: false, errors: [new ApiError({ type: 'event.update.starts_at.invalid', message: 'Invalid start date.' })]}));
    if (!req.body.ends_at) return res.status(400).json(new RO({ success: false, errors: [new ApiError({ type: 'event.update.ends_at.invalid', message: 'Invalid end date.' })]}));
    _this.db.Event.findById(req.params.event_id)
    .then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'event.update.not_found', message: 'No event found for provided id.' })]}));
      event.update({
        title: req.body.title,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at
      }).then((event) => {
        return res.status(201).json(new RO({ success: true, message: 'Event updated successfully.' }));
      });
    });
  }

  delete(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Event.findById(req.params.event_id)
    .then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'event.delete.not_found', message: 'No event found for provided id.' })]}));
      event.destroy();
      return res.status(200).json(new RO({ success: true, message: 'Event deleted.' }));
    });
  }

  isAuthorized(roles) {
    return function(req, res, next) {
      _this.hasRole(req.user, roles, function(result) {
        if (result) {
          if (_.intersection(roles, ['super_admin', 'any']).length) {
            next();
          } else {
            if (req.params.event_id) {
              _this.db.Event.findOne({ where: { id: req.params.event_id, owner_user_id: req.user.user_id }})
              .then((event) => {
                if (!event) {
                  return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'event.user.not_authorized', message: 'User is not authorized to view or modify the specified event.'})]}));
                } else {
                  return next();
                }
              });
            } else {
              return next();
            }
          }
        } else {
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'event.user.not_authorized', message: 'User is not authorized to view or modify the specified event.'})]}));
        }
      })
    }
  }
}

module.exports = Event;