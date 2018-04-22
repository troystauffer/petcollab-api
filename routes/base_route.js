import RO from '../lib/response_object';
import ApiError from '../lib/api_error';
let _this = {};

class BaseRoute {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  validationErrorResponse(res, errors) {
    return res.status(400).json(new RO({ success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [new ApiError({ type: 'api.params.invalid', validation: errors })]}));
  }
}

module.exports = BaseRoute;
