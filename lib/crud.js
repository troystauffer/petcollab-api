import _ from 'lodash';
import RO from './response_object';
import ApiError from './api_error';

let Crud = {
  delete: function({classname, db, req, res}) {
    this.validateId(classname, req);
    if (req.validationErrors()) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [new ApiError({ type: 'api.params.invalid', validation: req.validationErrors() })]}));
    db[classname].findById(req.params[_.snakeCase(classname) + '_id'])
    .then((item) => {
      if (!item) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: _.snakeCase(classname) + '.delete.not_found', message: 'No ' + _.snakeCase(classname) + ' found for provided id.'})]}));
      item.destroy();
      return res.status(200).json(new RO({ success: true, message: _.startCase(classname) + ' deleted.' }));
    });
  },
  detail: function({classname, db, req, res}) {
    this.validateId(classname, req);
    if (req.validationErrors()) return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [new ApiError({ type: 'api.params.invalid', validation: req.validationErrors() })]}));
    db[classname].findById(req.params[_.snakeCase(classname) + '_id'])
    .then((item) => {
      if (!item) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: _.snakeCase(classname) + '.detail.not_found', message: 'No ' + _.snakeCase(classname) + ' found for provided id.' })]}));
      let response = {};
      response[_.snakeCase(classname)] = item;
      return res.status(200).json(new RO({ success: true, response: response }));
    });
  },
  list: function({classname, db, res}) {
    db[classname].findAll()
    .then((items) => {
      let response = {};
      response[_.snakeCase(classname) + 's'] = items;
      return res.status(200).json(new RO({ success: true, response: response }));
    });
  },
  validateId: function(classname, req) {
    req.checkParams(_.snakeCase(classname) + '_id', 'A ' + _.startCase(classname) + ' id is required.').notEmpty().isNumeric();
  }
};

module.exports = Crud;
