import Stats from '../util/stats';

class JWS extends Stats {
  constructor() {
    super();
    this.calls.sign = 0;
  }
  sign(hash) {
    this.calls.sign++;
    return 'jsonwebtoken';
  }
}

module.exports = JWS;