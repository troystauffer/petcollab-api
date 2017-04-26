import Crypto from 'crypto';

let _this = {};

class Encryption {
  constructor(args = {}) {
    Object.keys(args).map((key) => { _this[key] = args[key]; });
  }

  encrypt(text) {
    let cipher = Crypto.createCipher(_this.config.algorithm, _this.config.secret);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(text) {
    try {
      let decipher = Crypto.createDecipher(_this.config.algorithm, _this.config.secret);
      let dec = decipher.update(text, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    } catch (e) {
      return false;
    }
  }
}

module.exports = Encryption;