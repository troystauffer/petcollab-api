class Pwcrypt {
  secureHash(password, callback) { return callback(null, 'encryptedpassword', 'salt') }
}

module.exports = new Pwcrypt;