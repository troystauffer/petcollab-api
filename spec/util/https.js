import Stats from '../util/stats';

class HTTPS extends Stats {
  constructor() {
    super();
    this.calls.request = 0;
  }
  request(options, callback) {
    this.calls.request++;
    callback({
      on: function(type, callback) {
        callback('{"access_token": "authtoken"}');
      }
    });
    return {
      end: function() {}
    }
  }
}

module.exports = HTTPS;