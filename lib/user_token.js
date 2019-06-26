'use strict';
let db = {};
let log = {};
const whilst = require('async.whilst');
function UserToken(_db, _log) {
  db = _db;
  log = _log;
  this.generateRandomString = function(length = 6) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
}

UserToken.prototype.generateToken = function(length = 6, cb) {
  log.info('generating token');
  let unique = false;
  whilst(function() { return !unique; }, function(callback) {
    log.info('whilst');
    let proposed = this.generateRandomString(length);
    db.User.findOne({ where: { confirmation_token: proposed }}).then(function(user) {
      log.info('finding user');
      if (!user) unique = true;
      log.info('user');
      callback(null, proposed);
    });
  }.bind(this), function(err, token) {
    log.info('cb');
    cb(token);
  });
};

module.exports = UserToken;