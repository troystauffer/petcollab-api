class ApiError {
  constructor({type, message='', detail='', validation=[]} = {}) {
    if (typeof type == 'undefined') throw new ErrorInitException('Must provide type parameter.');
    this.type = type;
    this.message = message;
    this.detail = detail;
    this.validation = validation;
    return this.obj();
  }

  obj() {
    let r = {
      type: this.type
    }
    if (this.message != '') r.message = this.message;
    if (this.detail != '') r.detail = this.detail;
    if (Object.keys(this.validation).length !== 0) r.validation = this.validation;
    return r;
  }
}

function ErrorInitException(message='') {
  this.name = 'ErrorInitException';
  this.message = message;
}

module.exports = ApiError;