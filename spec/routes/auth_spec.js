import Auth from '../../routes/auth/auth';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import JWS from '../util/jws';
import dbFailures from '../util/db_failures';
import Pwcrypt from '../util/pwcrypt';
import PwcryptError from '../util/pwcrypt_error';
import PwcryptInvalid from '../util/pwcrypt_invalid';
import log from '../util/log';
import HTTPS from '../util/https';
import Encryption from '../util/encryption';

describe('Auth', () => {
  let res, req, authRoutes, pwcrypt, pwcryptError, pwcryptInvalid, https, jws = {};
  let encryption = new Encryption();
  const config = { jws: { algorithm: 'fake' }};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    pwcrypt = new Pwcrypt();
    pwcryptError = new PwcryptError();
    pwcryptInvalid = new PwcryptInvalid();
    https = new HTTPS();
    jws = new JWS();
    authRoutes = new Auth({ 'db': db, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log, 'https': https, 'encryption': encryption });
  })

  describe('standard authentication', () => {
    it('should fail without email', () => {
      req.body = { password: 'password' };
      let validationErrors = [{ param: 'email', msg: 'Email is required.' }, { param: 'email', msg: 'Email must be a valid email address.' }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, {success:false, "message":"The data provided to the API was invalid or incomplete.","errors":validationErrors}, 400, authRoutes.authenticate);
    });

    it('should fail without password', () => {
      req.body = { email: 'testunit@example.com' };
      let validationErrors = [{"param":"password","msg":"A valid password is required."}];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, {success:false, "message":"The data provided to the API was invalid or incomplete.","errors":validationErrors}, 400, authRoutes.authenticate);
    });

    it('should fail on invalid email', () => {
      let authRoutesFailures = new Auth({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'invalid@example.com',
        password: 'password'
      };
      validate(req, res, {"success":false,"errors":[{"type":"auth.authenticate.user.not_found","message":"No such user."}]}, 400, authRoutesFailures.authenticate);
    });

    it('should fail on tampered password hash', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptError, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        password: 'tampered'
      };
      validate(req, res, { success: false, errors: [{ type: 'auth.authenticate.password.invalid', message: 'An error occurred decrypting the password.' }]}, 500, authRoutesFailures.authenticate);
      // expect(pwcryptError.calls.verify).toEqual(1);
    });

    it('should fail on incorrect password', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptInvalid, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        password: 'incorrect'
      };
      validate(req, res, {"success":false,"errors":[{"type":"auth.authenticate.password.invalid","message":"Invalid password."}]}, 400, authRoutesFailures.authenticate);
      expect(pwcryptInvalid.calls.verify).toEqual(1);
    });

    it('should authenticate users', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      validate(req, res, { success: true, "message": "Authenticated successfully.", response: {"token": "encrypted"} }, 200, authRoutes.authenticate);
      expect(pwcrypt.calls.verify).toEqual(1);
      expect(jws.calls.sign).toEqual(1);
    });
  });
});