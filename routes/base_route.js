let _this = {};

class BaseRoute {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  validationErrorResponse(res, errors) {
    return res.status(400).json({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [{ type: 'api.params.invalid', validation: errors }]});
  }
}

module.exports = BaseRoute;
