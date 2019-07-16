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
import Encryption from '../util/encryption';

describe('Auth', () => {
  let res, req, authRoutes, pwcrypt, pwcryptError, pwcryptInvalid, jws, expressValidate = {};
  let encryption = new Encryption();
  const config = { jws: { algorithm: 'fake' }};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    pwcrypt = new Pwcrypt();
    pwcryptError = new PwcryptError();
    pwcryptInvalid = new PwcryptInvalid();
    jws = new JWS();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    authRoutes = new Auth({ db, pwcrypt, jws, config, log, encryption, validate: expressValidate });
  });

  describe('standard authentication', () => {
    it('should fail without email', () => {
      req.body = { password: 'password' };
      let validationErrors = [{ param: 'email', message: 'Email is required.' }, { param: 'email', message: 'Email must be a valid email address.' }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let authRoutesFailures = new Auth({ db, pwcrypt, jws, config, log, encryption, validate: expressValidate });
      validateRequest(req, res, {success:false, "message":"The data provided to the API was invalid or incomplete.","errors":validationErrors}, 400, authRoutesFailures.authenticate);
    });

    it('should fail without password', () => {
      req.body = { email: 'testunit@example.com' };
      let validationErrors = [{"param":"password","message":"A valid password is required."}];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let authRoutesFailures = new Auth({ db, pwcrypt, jws, config, log, encryption, validate: expressValidate });
      validateRequest(req, res, {success:false, "message":"The data provided to the API was invalid or incomplete.","errors":validationErrors}, 400, authRoutesFailures.authenticate);
    });

    it('should fail on invalid email', () => {
      let authRoutesFailures = new Auth({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log, 'validate': expressValidate });
      req.body = {
        email: 'invalid@example.com',
        password: 'password'
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"auth.authenticate.user.not_found","message":"No such user."}]}, 400, authRoutesFailures.authenticate);
    });

    it('should fail on tampered password hash', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptError, 'jws': jws, 'config': config, 'log': log, 'validate': expressValidate });
      req.body = {
        email: 'testunit@example.com',
        password: 'tampered'
      };
      validateRequest(req, res, { success: false, errors: [{ type: 'auth.authenticate.password.invalid', message: 'An error occurred decrypting the password.' }]}, 500, authRoutesFailures.authenticate);
    });

    it('should fail on incorrect password', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptInvalid, 'jws': jws, 'config': config, 'log': log, 'validate': expressValidate });
      req.body = {
        email: 'testunit@example.com',
        password: 'incorrect'
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"auth.authenticate.password.invalid","message":"Invalid password."}]}, 400, authRoutesFailures.authenticate);
    });

    it('should authenticate users', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      validateRequest(req, res, { success: true, "message": "Authenticated successfully.", response: {"token": "encrypted", role: { id: 1, title: "user" }}}, 200, authRoutes.authenticate);
    });
  });
});