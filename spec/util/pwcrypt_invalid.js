import Pwcrypt from '../util/pwcrypt';

class PwcryptInvalid extends Pwcrypt {
  verify(salt, hash, password, callback) {
    this.calls.verify++;
    return callback(null, false);
  }
}

module.exports = PwcryptInvalid;