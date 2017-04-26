import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';

let _this = {};

class Rescue extends BaseRoute{
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    _this.db.Rescue.findAll().then((rescues) => {
      _this.log.info('Listing rescues for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, response: rescues }));
    })
  }

  detail(req, res) {
    req.checkParams('rescue_id', 'A rescue id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Rescue.findById(req.params.rescue_id).then((rescue) => {
      if (!rescue) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'rescue.detail.not_found', message: 'No rescue found for provided id.' })]}));
      _this.log.info('Detailing rescue ' + req.params.rescue_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, response: rescue }));
    });
  }

  create(req, res) {
    _this.db.Rescue.create({
      name: req.body.name,
      street_address: req.body.street_address,
      city: req.body.city,
      state: req.body.state,
      zip_code: req.body.zip_code
    }).then((rescue) => {
      _this.log.info('Created new rescue ' + rescue.name + ', id: ' + rescue.id + ' for user ' + req.user.email);
      return res.status(201).json(new RO({ success: true, message: 'Rescue created successfully.', response: rescue}));
    });
  }

  update(req, res) {
    req.checkParams('rescue_id', 'A rescue id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Rescue.findById(req.params.rescue_id)
    .then((rescue) => {
      if (!rescue) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'rescue.update.not_found', message: 'No event found for provided id.' })]}));
      rescue.update({
        name: req.body.name,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code
      }).then((rescue) => {
        _this.log.info('Updated rescue ' + rescue.name + ', id: ' + rescue.id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Rescue updated successfully.' }));
      });
    });
  }

  delete(req, res) {
    req.checkParams('rescue_id', 'A rescue id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Rescue.findById(req.params.rescue_id)
    .then((rescue) => {
      if (!rescue) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'rescue.delete.not_found', message: 'No rescue found for provided id.' })]}));
      rescue.destroy();
      _this.log.info('Deleted rescue ' + req.params.rescue_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, message: 'Rescue deleted.' }));
    });
  }
}

module.exports = Rescue;