module.exports = {
  verify: function(salt, hash, password, callback) { return callback({ 'error1': 'An error', 'error2': 'Another error' })}
}