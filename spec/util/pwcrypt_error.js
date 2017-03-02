import Pwcrypt from '../util/pwcrypt';

class PwcryptError extends Pwcrypt {
  verify(salt, hash, password, callback) {
    this.calls.verify++;
    return callback({ 'error1': 'An error', 'error2': 'Another error' });
  }
}

module.exports = PwcryptError;