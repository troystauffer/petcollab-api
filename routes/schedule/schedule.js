import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';

let _this = {};

class Schedule extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Schedule.findAll({ where: { event_id: req.params.event_id }})
    .then((schedules) => {
      _this.log.info('Listing schedules for event ' + req.params.event_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, response: { schedules }}));
    });
  }

  detail(req, res) {
    req.checkParams('schedule_id', 'A schedule id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Schedule.findById(req.params.schedule_id)
    .then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.detail.not_found', message: 'No schedule found for provided id.'})]}));
      _this.log.info('Detailing schedule ' + req.params.schedule_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, response: {schedule}}));
    });
  }

  create(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    req.checkBody('title', 'Title is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Event.findById(req.params.event_id).then((event) => {
      if (!event) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.create.not_found', message: 'No event found for provided id.'})]}));
      _this.db.Schedule.create({
        event_id: event.id,
        title: req.body.title
      }).then((schedule) => {
        _this.log.info('Created schedule for event ' + req.params.event_id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Schedule created successfully.', response: { schedule }}));
      });
    });
  }

  update(req, res) {
    req.checkParams('schedule_id', 'A schedule id is required.').notEmpty().isNumeric();
    req.checkBody('title', 'Title is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Schedule.findById(req.params.schedule_id)
    .then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.update.not_found', message: 'No schedule found for provided id.'})]}));
      schedule.update({
        title: req.body.title,
      }).then((schedule) => {
        _this.log.info('Updated schedule ' + req.params.schedule_id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Schedule updated successfully.' }));
      });
    });
  }

  delete(req, res) {
    req.checkParams('schedule_id', 'A schedule id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Schedule.findById(req.params.schedule_id)
    .then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.delete.not_found', message: 'No schedule found for provided id.'})]}));
      schedule.destroy();
      _this.log.info('Deleted schedule ' + req.params.schedule_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, message: 'Schedule deleted.' }));
    });
  }

  isAuthorized(roles) {
    let hasRole = super.hasRole;
    return function(req, res, next) {
      hasRole(req.user, roles, function(result) {
        if (result) {
          if (_.intersection(roles, ['super_admin', 'any']).length) {
            _this.log.info('Access granted for user ' + req.user.email);
            next();
          } else {
            if (req.params.event_id) {
              _this.db.Event.findOne({ where: { id: req.params.event_id, owner_user_id: req.user.user_id }}).then((event) => {
                if (!event) {
                  _this.log.info('Access denied for user ' + req.user.email);
                  return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.user.not_authorized', message: 'User is not authorized to view or modify the specified event.'})]}));
                } else {
                  _this.log.info('Access granted for user ' + req.user.email);
                  return next();
                }
              });
            } else {
              _this.db.Schedule.findOne({ where: { id: req.params.schedule_id }, include: [{ model: _this.db.Event, where:{ owner_user_id: req.user.user_id }}]}).then((schedule) => {
                if (schedule) {
                  schedule.getEvent().then((event) => {
                    if (event && event.owner_user_id == req.user.user_id) {
                      _this.log.info('Access granted for user ' + req.user.email);
                      next();
                    } else {
                      _this.log.info('Access granted for user ' + req.user.email);
                      return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.user.not_authorized', message: 'User is not authorized to view or modify the specified schedule.'})]}));
                    }
                  })
                } else {
                  _this.log.info('Access granted for user ' + req.user.email);
                  return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.user.not_authorized', message: 'User is not authorized to view or modify the specified schedule.'})]}));
                }
              })
            }
          }
        } else {
          _this.log.info('Access granted for user ' + req.user.email);
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.user.not_authorized', message: 'User is not authorized.'})]}));
        }
      });
    }
  }
}

module.exports = Schedule;