import Stats from '../util/stats';

class Pwcrypt extends Stats {
  constructor() {
    super();
    this.calls.secureHash = 0;
    this.calls.verify = 0;
  }
  secureHash(password, callback) {
    this.calls.secureHash++;
    return callback(null, 'encryptedpassword', 'salt');
  }
  verify(salt, hash, password, callback) {
    this.calls.verify++;
    return callback(null, true);
  }
}

module.exports = Pwcrypt;