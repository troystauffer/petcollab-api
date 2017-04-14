const RO = require('../../lib/response_object');

let _this = {};

let Event = function(args = {}) {
  Object.keys(args).map((key) => { _this[key] = args[key]; });
};

Event.prototype.events = function(req, res) {
  _this.db.Event.findAll({ order: [['starts_at', 'DESC']] })
  .then((events) => {
    return res.status(200).json(new RO({ success: true, response: { events }}).obj());
  })
}

Event.prototype.event = function(req, res) {
}

Event.prototype.create = function(req, res) {
}

Event.prototype.update = function(req, res) {
}

Event.prototype.delete = function(req, res) {
}

module.exports = Event;