import BaseRoute from '../base_route';
import Crud from '../../lib/crud';

let _this = {};

class Rescue extends BaseRoute{
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  list(req, res) {
    Crud.list({ classname: 'Rescue', db: _this.db, res: res });
  }

  detail(req, res) {
    Crud.detail({ classname: 'Rescue', db: _this.db, req: req, res: res });
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
      return res.status(201).json({ success: true, message: 'Rescue created successfully.', response: {rescue}});
    });
  }

  update(req, res) {
    req.checkParams('rescue_id', 'A rescue id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Rescue.findById(req.params.rescue_id)
    .then((rescue) => {
      if (!rescue) return res.status(404).json({ success: false, errors: [{ type: 'rescue.update.not_found', message: 'No event found for provided id.' }]});
      rescue.update({
        name: req.body.name,
        street_address: req.body.street_address,
        city: req.body.city,
        state: req.body.state,
        zip_code: req.body.zip_code
      }).then((rescue) => {
        _this.log.info('Updated rescue ' + rescue.name + ', id: ' + rescue.id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Rescue updated successfully.' });
      });
    });
  }

  delete(req, res) {
    Crud.delete({ classname: 'Rescue', db: _this.db, req: req, res: res });
  }
}

module.exports = Rescue;
