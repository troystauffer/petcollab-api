import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';
import Crud from '../../lib/crud';

let _this = {};

class ScheduleItem extends BaseRoute {
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    req.checkParams('schedule_id', 'A schedule id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.ScheduleItem.findAll({ where: { schedule_id: req.params.schedule_id }})
    .then((schedule_items) => {
      _this.log.info('Listing schedule items for schedule ' + req.params.schedule_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, response: { schedule_items }}));
    });
  }

  detail(req, res) {
    Crud.detail({ classname: 'ScheduleItem', db: _this.db, req: req, res: res });
  }

  create(req, res) {
    req.checkParams('schedule_id', 'A schedule id is required.').notEmpty().isNumeric();
    req.checkBody('assigned_user_id', 'User id must be numeric').isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    _this.db.Schedule.findById(req.params.schedule_id).then((schedule) => {
      if (!schedule) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule_item.create.not_found', message: 'No schedule found for provided id.'})]}));
      _this.db.ScheduleItem.create({
        schedule_id: schedule.id,
        assigned_user_id: req.body.assigned_user_id || null,
        title: req.body.title || null,
        starts_at: req.body.starts_at,
        ends_at: req.body.ends_at,
        order: req.body.order || null
      }).then((schedule_item) => {
        _this.log.info('Created schedule item ' + schedule_item.id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Schedule item created successfully.', response: { schedule_item }}));
      });
    });
  }

  update(req, res) {
    req.checkParams('schedule_item_id', 'A schedule item id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    req.sanitizeBody('starts_at').toDate();
    req.sanitizeBody('ends_at').toDate();
    req.sanitizeBody('checked_in_at').toDate();
    _this.db.ScheduleItem.findById(req.params.schedule_item_id)
    .then((item) => {
      if (!item) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule_item.update.not_found', message: 'No schedule_item found for provided id.'})]}));
      let updateParams = {};
      if (req.body.assigned_user_id) updateParams['assigned_user_id'] = req.body.assigned_user_id;
      if (req.body.title) updateParams['title'] = req.body.title;
      if (req.body.starts_at) updateParams['starts_at'] = req.body.starts_at;
      if (req.body.ends_at) updateParams['ends_at'] = req.body.ends_at;
      if (req.body.order) updateParams['order'] = req.body.order;
      if (req.body.checked_in_at) updateParams['checked_in_at'] = req.body.checked_in_at;
      item.update(updateParams).then((item) => {
        _this.log.info('Updated schedule item ' + item.id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Schedule item updated successfully.' }));
      });
    });
  }

  delete(req, res) {
    Crud.delete({ classname: 'ScheduleItem', db: _this.db, req: req, res: res });
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
            if (req.params.schedule_id) {
              _this.db.Schedule.findOne({ where: { id: req.params.schedule_id }, include: [{ model: _this.db.Event, where: { owner_user_id: req.user.user_id }}]})
              .then((schedule) => {
                if (!schedule) {
                  _this.log.info('Access denied for user ' + req.user.email);
                  return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule_item.user.not_authorized', message: 'User is not authorized to view or modify the specified schedule.'})]}));
                } else {
                  _this.log.info('Access granted for user ' + req.user.email);
                  return next();
                }
              });
            } else if (req.params.schedule_item_id) {
              _this.db.ScheduleItem.findOne({ where: { id: req.params.schedule_item_id, $or: [{ assigned_user_id: req.user.user_id }, { 'event.owner_user_id': req.user.user_id }]}, include: [{ model: _this.db.Schedule, as: 'schedule', include: [{ model: _this.db.Event, as: 'event' }]}]})
              .then((item) => {
                if (item) {
                  _this.log.info('Access granted for user ' + req.user.email);
                  return next();
                } else {
                  _this.log.info('Access denied for user ' + req.user.email);
                  return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule_item.user.not_authorized', message: 'User is not authorized to view or modify the specified schedule_item.'})]}));
                }
              });
            }
          }
        } else {
          _this.log.info('Access denied for user ' + req.user.email);
          return res.status(403).json(new RO({ success: false, errors: [new ApiError({ type: 'schedule_item.user.not_authorized', message: 'User is not authorized.'})]}));
        }
      });
    };
  }
}

module.exports = ScheduleItem;
