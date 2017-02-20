import path from 'path';
import Auth from '../../routes/auth/auth';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import jws from '../util/jws';
import dbFailures from '../util/db_failures';
import pwcrypt from '../util/pwcrypt';
import pwcryptError from '../util/pwcrypt_error';
import pwcryptInvalid from '../util/pwcrypt_invalid';
import log from '../util/log';

describe('Auth', () => {
  let res = {};
  let req = {};
  let authRoutes = {};
  const config = { 'facebook': { 'ogurl': '' }, jws: { algorithm: 'fake' }};
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    authRoutes = new Auth({ 'db': db, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log });
  })

  describe('standard authentication', () => {
    it('should fail without email', () => {
      let error = [{"param":"email","msg":"Email is required."},{"param":"email","msg":"Email must be a valid email address."}];
      req.body = { password: 'password' };
      req.validationErrors = function() { return [error] };
      validate(req, res, {"message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, authRoutes.auth);
    });

    it('should fail without password', () => {
      let error = {"param":"password","msg":"A valid password is required."};
      req.body = { email: 'testunit@example.com' };
      req.validationErrors = function() { return [error] };
      validate(req, res, {"message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, authRoutes.auth);
    });

    it('should fail on invalid email', () => {
      let authRoutesFailures = new Auth({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'invalid@example.com',
        password: 'password'
      };
      validate(req, res, { message: 'No such user.'}, 400, authRoutesFailures.auth);
    });

    it('should fail on tampered password hash', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptError, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        password: 'tampered'
      };
      validate(req, res, { message: 'An error occurred decrypting the password.', errors: { error1: 'An error', error2: 'Another error' } }, 500, authRoutesFailures.auth);
    });

    it('should fail on incorrect password', () => {
      let authRoutesFailures = new Auth({ 'db': db, 'pwcrypt': pwcryptInvalid, 'jws': jws, 'config': config, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        password: 'incorrect'
      };
      validate(req, res, {"message":"Invalid password."}, 400, authRoutesFailures.auth);
    });

    it('should authenticate users', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      validate(req, res, { "message": "Authenticated successfully.", "token": "jsonwebtoken" }, 200, authRoutes.auth);
    });
  });
});