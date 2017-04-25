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
      return res.status(200).json(new RO({ success: true, response: rescues }));
    })
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
}

module.exports = Rescue;