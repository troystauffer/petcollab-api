import _ from 'lodash';

class Crud {
  constructor(args = {}) {
    Object.keys(args).map((key) => { this[key] = args[key]; });
  }

  delete({classname, req, res}) {
    const errors = this.validate(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false,
      message: 'The data provided to the API was invalid or incomplete.', errors: req.validationErrors() });
    this.db[classname].findByPk(req.params[_.snakeCase(classname) + '_id']).then((item) => {
      if (!item) return res.status(404).json({ success: false, errors: [{
        type: _.snakeCase(classname) + '.delete.not_found',
        message: 'No ' + _.snakeCase(classname) + ' found for provided id.'
      }]});
      item.destroy();
      return res.status(200).json({ success: true, response: { message: _.startCase(classname) + ' deleted.' }});
    });
  }

  detail({classname, req, res}) {
    const errors = this.validate(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false,
      message: 'The data provided to the API was invalid or incomplete.', errors: req.validationErrors() });
    this.db[classname].findByPk(req.params[_.snakeCase(classname) + '_id']).then((item) => {
      if (!item) return res.status(404).json({ success: false, errors: [{
        type: _.snakeCase(classname) + '.detail.not_found',
        message: 'No ' + _.snakeCase(classname) + ' found for provided id.'
      }]});
      let response = {};
      response[_.snakeCase(classname)] = item;
      return res.status(200).json({ success: true, response: response });
    });
  }

  list({classname, foreignKeyClassname=false, foreignKeyValue=0, res}) {
    let whereClause = { where: {}};
    if (foreignKeyClassname) {
      whereClause.where[_.snakeCase(foreignKeyClassname + '_id')] = foreignKeyValue;
    }
    this.db[classname].findAll(whereClause).then((items) => {
      let response = {};
      response[_.snakeCase(classname) + 's'] = items;
      return res.status(200).json({ success: true, response: response });
    });
  }
}

module.exports = Crud;