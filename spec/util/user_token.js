import Stats from '../util/stats';

class UserToken extends Stats {
  constructor() {
    super();
    this.calls.generateToken = 0;
  }
  generateToken(length, callback) {
    this.calls.generateToken++;
    callback('token');
  }
}

module.exports = UserToken;