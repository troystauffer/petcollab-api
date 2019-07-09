import _ from 'lodash';

let Crud = {
  delete: function({classname, db, req, res}) {
    this.validateId(classname, req);
    if (req.validationErrors()) return res.status(400).json({ success: false,
      message: 'The data provided to the API was invalid or incomplete.', errors: req.validationErrors() });
    db[classname].findByPk(req.params[_.snakeCase(classname) + '_id']).then((item) => {
      if (!item) return res.status(404).json({ success: false, errors: [{
        type: _.snakeCase(classname) + '.delete.not_found',
        message: 'No ' + _.snakeCase(classname) + ' found for provided id.'
      }]});
      item.destroy();
      return res.status(200).json({ success: true, response: { message: _.startCase(classname) + ' deleted.' }});
    });
  },
  detail: function({classname, db, req, res}) {
    this.validateId(classname, req);
    if (req.validationErrors()) return res.status(400).json({ success: false,
      message: 'The data provided to the API was invalid or incomplete.', errors: req.validationErrors() });
    db[classname].findByPk(req.params[_.snakeCase(classname) + '_id']).then((item) => {
      if (!item) return res.status(404).json({ success: false, errors: [{
        type: _.snakeCase(classname) + '.detail.not_found',
        message: 'No ' + _.snakeCase(classname) + ' found for provided id.'
      }]});
      let response = {};
      response[_.snakeCase(classname)] = item;
      return res.status(200).json({ success: true, response: response });
    });
  },
  list: function({classname, foreignKeyClassname=false, foreignKeyValue=0, db, res}) {
    let whereClause = { where: {}};
    if (foreignKeyClassname) {
      whereClause.where[_.snakeCase(foreignKeyClassname + '_id')] = foreignKeyValue;
    }
    db[classname].findAll(whereClause).then((items) => {
      let response = {};
      response[_.snakeCase(classname) + 's'] = items;
      return res.status(200).json({ success: true, response: response });
    });
  },
  validateId: function(classname, req) {
    req.checkParams(_.snakeCase(classname) + '_id', 'A ' + _.startCase(classname) + ' id is required.')
      .notEmpty().isNumeric();
  }
};

module.exports = Crud;
