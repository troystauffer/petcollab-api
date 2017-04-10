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

describe('Auth', () => {
  let res = {};
  let req = {};
  let authRoutes = {};
  let pwcrypt = {};
  let pwcryptError = {};
  let pwcryptInvalid = {};
  let https = {};
  let jws = {};
  const config = { 'facebook': { 'ogurl': '', 'clientID': '', 'clientSecret': '', 'redirectUri': '' }, jws: { algorithm: 'fake' }};
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    pwcrypt = new Pwcrypt();
    pwcryptError = new PwcryptError();
    pwcryptInvalid = new PwcryptInvalid();
    https = new HTTPS();
    jws = new JWS();
    authRoutes = new Auth({ 'db': db, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log, 'https': https });
  })

  describe('standard authentication', () => {
    it('should fail without email', () => {
      let error = [{"param":"email","msg":"Email is required."},{"param":"email","msg":"Email must be a valid email address."}];
      req.body = { password: 'password' };
      req.validationErrors = function() { return [error] };
      validate(req, res, {success:false, "message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, authRoutes.auth);
    });

    it('should fail without password', () => {
      let error = {"param":"password","msg":"A valid password is required."};
      req.body = { email: 'testunit@example.com' };
      req.validationErrors = function() { return [error] };
      validate(req, res, {success:false, "message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, authRoutes.auth);
    });

    it('should fail on invalid email', () => {
      let authRoutesFailures = new Auth({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'invalid@example.com',
        password: 'password'
      };
      validate(req, res, { success: false, message: 'No such user.' }, 400, authRoutesFailures.auth);
    });

    it('should fail on tampered password hash', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptError, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        password: 'tampered'
      };
      validate(req, res, { success: false, message: 'An error occurred decrypting the password.', errors: { error1: 'An error', error2: 'Another error' } }, 500, authRoutesFailures.auth);
      expect(pwcryptError.calls.verify).toEqual(1);
    });

    it('should fail on incorrect password', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptInvalid, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        password: 'incorrect'
      };
      validate(req, res, {success: false, "message":"Invalid password."}, 400, authRoutesFailures.auth);
      expect(pwcryptInvalid.calls.verify).toEqual(1);
    });

    it('should authenticate users', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      validate(req, res, { success: true, "message": "Authenticated successfully.", response: {"token": "jsonwebtoken"} }, 200, authRoutes.auth);
      expect(pwcrypt.calls.verify).toEqual(1);
      expect(jws.calls.sign).toEqual(1);
    });
  });
  describe('facebook authentication', () => {
    it('should fail without a facebook auth code', () => {
      let error = {"param":"code","msg":"A facebook auth code is required."};
      req.validationErrors = function() { return [error] };
      validate(req, res, {success: false, "message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, authRoutes.facebook);
      expect(https.calls.request).toEqual(0);
      expect(jws.calls.sign).toEqual(0);
    });

    it('should authenticate successfully', () => {
      req.body = { code: 'facebookcode' };
      validate(req, res, { success: true, message: 'Authenticated successfully.', response: {token: 'jsonwebtoken'} }, 200, authRoutes.facebook);
      expect(https.calls.request).toEqual(2);
      expect(jws.calls.sign).toEqual(1);
    });
  });
});