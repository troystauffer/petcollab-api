'use strict';

let passport = {};
let db = {};
let log = {};

function User(_passport, _db, _log) {
  passport = _passport;
  db = _db;
  log = _log;
  // passport creation here

  return this;
}

User.prototype.info = function(req, res) {
  return res.status(200).json({
    info: 'User info goes here'
  });
};

module.exports = User;