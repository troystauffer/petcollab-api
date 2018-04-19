import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';
import Crud from '../../lib/crud';
import Authorized from '../../lib/authorized';

let _this = {};

class Schedule extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    req.checkParams('event_id', 'An event id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    Crud.list({ classname: 'Schedule', foreignKeyClassname: 'event', foreignKeyValue: req.params.schedule_id, db: _this.db, res: res });
  }

  detail(req, res) {
    Crud.detail({ classname: 'Schedule', db: _this.db, req: req, res: res });
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
      schedule.update({ title: req.body.title }).then(() => {
        _this.log.info('Updated schedule ' + req.params.schedule_id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Schedule updated successfully.' }));
      });
    });
  }

  delete(req, res) {
    Crud.delete({ classname: 'Schedule', db: _this.db, req: req, res: res });
  }

  isAuthorized(roles) {
    let hasRole = super.hasRole;
    return function(req, res, next) {
      hasRole(req.user, roles, function(result) {
        if (result) {
          if (_.intersection(roles, ['super_admin', 'any']).length) {
            _this.log.info('Access granted for user ' + req.user.email);
            return next();
          } else {
            return Authorized.isAuthorizedForId({ classname: 'Schedule', checkParentOwner: true, parentClassname: 'Event', db: _this.db, req: req, res: res, next: next });
          }
        } else {
          _this.log.info('Access granted for user ' + req.user.email);
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule.user.not_authorized', message: 'User is not authorized.'})]}));
        }
      });
    };
  }
}

module.exports = Schedule;
