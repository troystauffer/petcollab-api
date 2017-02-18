var util = require('util');
var events = require('events').EventEmitter;

var res = function () {
  return this;
};

util.inherits(res, events);

res.prototype.send = function(payload, code) {
  this.emit('send', {
    code: code,
    response: payload
  });
};

res.prototype.json = function(payload) {
  this.emit('json', {
    response: payload
  });
};

res.prototype.status = function(code) {
  this.emit('status', {
    code: code
  });
  return this;
};

module.exports = res;