class RO {
  constructor({success, message='', errors=[], response={}} = {}) {
    if (typeof success == 'undefined') throw new ROInitException('Must provide success parameter.');
    this.success = success;
    this.message = message;
    this.errors = errors;
    this.response = response;
    return this.obj();
  }
  obj() {
    let r = { success: this.success };
    if (this.message) r.message = this.message;
    if (Object.keys(this.errors).length !== 0) r.errors = this.errors;
    if (Object.keys(this.response).length !== 0) r.response = this.response;
    return r;
  }
}

function ROInitException(message='') {
  this.name = 'ROInitException';
  this.message = message;
}

module.exports = RO;