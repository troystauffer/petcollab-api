module.exports = {
  secureHash: function(password, callback) { return callback(null, 'encryptedpassword', 'salt') },
  verify: function(salt, hash, password, callback) { return callback(null, true)}
}