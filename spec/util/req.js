class Req {
  constructor() {
    this.checkBody = function() { return this };
    this.checkParams = function() { return this };
    this.notEmpty = function() { return this };
    this.isNumeric = function() { return this };
    this.isLength = function() { return this };
    this.isBoolean = function() { return this };
    this.isEmail = function() { return this };
    this.validationErrors = function() { return null };
    this.user = { user_id: 1 };
  }
}

module.exports = Req;