import Stats from '../util/stats';

class Req extends Stats{
  constructor() {
    super();
    this.calls.checkBody = 0;
    this.calls.checkParams = 0;
    this.calls.notEmpty = 0;
    this.calls.isNumeric = 0;
    this.calls.isLength = 0;
    this.calls.isBoolean = 0;
    this.calls.isEmail = 0;
    this.calls.isAlphanumeric = 0;
    this.calls.validationErrors = 0;
    this.user = { user_id: 1 };
  }
  checkBody() {
    this.calls.checkBody++;
    return this;
  }
  checkParams() {
    this.calls.checkParams++;
    return this
  }
  notEmpty() {
    this.calls.notEmpty++;
    return this;
  }
  isNumeric() {
    this.calls.isNumeric++;
    return this;
  }
  isLength() {
    this.calls.isLength++;
    return this;
  }
  isBoolean() {
    this.calls.isBoolean++;
    return this;
  }
  isEmail() {
    this.calls.isEmail++;
    return this;
  }
  isAlphanumeric() {
    this.calls.isAlphanumeric++;
    return this;
  }
  validationErrors() {
    this.calls.validationErrors++;
    return null;
  }
}

module.exports = Req;