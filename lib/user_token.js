'use strict';
let db = {};
const whilst = require('async/whilst');
function UserToken(_db) {
  db = _db;
  this.generateRandomString = function(length = 6) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;    
  };
}

UserToken.prototype.generateToken = function(length = 6, cb) {
  let unique = false;
  whilst(function() { return !unique; }, function(callback) {
    let proposed = this.generateRandomString(length);
    db.User.findOne({ where: { confirmation_token: proposed }})
    .then(function(user) {
      if (!user)
        unique = true;
      callback(null, proposed);
    });
  }.bind(this), function(err, token) {
    cb(token);
  });
}

module.exports = UserToken;