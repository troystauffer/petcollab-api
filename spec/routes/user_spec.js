import path from 'path';
import User from '../../routes/user/user';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import Pwcrypt from '../util/pwcrypt';
import UserToken from '../util/user_token';
import log from '../util/log';

describe('User', () => {
  let res = {};
  let req = {};
  let userRoutes = {};
  let pwcrypt = {};
  let userToken = {};
  const config = { 'confirmationTokenLength': 6 };
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    pwcrypt = new Pwcrypt();
    userToken = new UserToken();
    userRoutes = new User({ 'db': db, 'pwcrypt': pwcrypt, 'config': config, 'UserToken': userToken, 'log': log });
  })

  describe('misc endpoints', () => {
    it('should return user info', () => {
      validate(req, res, { success: true, response: {user: { user_id: 1 }}}, 200, userRoutes.info);
    });

    it('should return a well formed error', () => {
      validate(req, res, { success: false, message: 'An error occurred.' }, 400, userRoutes.error);
    });

    it('should return the user fields', () => {
      validate(req, res, { success: true, response: userDescribe}, 200, userRoutes.fields);
    });
  });

  describe('creation', () => {
    it('should fail without email', () => {
      let error = [{ "param": "email", "msg": "Email is required." }, { "param": "email", "msg": "Email must be a valid email address." }];
      req.body = {
        password: 'password',
        name: 'Test Unit'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without password', () => {
      let error = { "param": "password", "msg": "Password is required." };
      req.body = {
        email: 'testunit@example.com',
        name: 'Test Unit'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without name', () => {
      let error = { "param": "name", "msg": "Name is required." };
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without a valid email', () => {
      let error = { "param": "email", "msg": "Email must be a valid email address." };
      req.body = {
        email: 'testunit',
        password: 'password',
        name: 'Test Unit'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should create a user', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password',
        name: 'Test Unit'
      };
      validate(req, res, { success: true, "message": "Account created successfully." }, 201, userRoutes.create);
      expect(pwcrypt.calls.secureHash).toEqual(1);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
      expect(req.calls.validationErrors).toEqual(1);
      expect(userToken.calls.generateToken).toEqual(1);
    });

    it('should prevent duplicate email addresses', () => {
      let userRoutesFailure = new User({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'config': config, 'UserToken': userToken, 'log': log });
      req.body = {
        email: 'duplicate@example.com',
        password: 'password',
        name: 'Test Unit'
      };
      validate(req, res, { success: false, "message": "User with this email already exists." }, 400, userRoutesFailure.create);
      expect(pwcrypt.calls.secureHash).toEqual(1);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
      expect(req.calls.validationErrors).toEqual(1);
    });
  });

  describe('confirmation', () => {
    it('should fail without a confirmation token', () => {
      let error = {"param":"confirmation_token","msg":"A valid confirmation token is required."};
      req.body = { email: 'testunit@example.com' };
      req.validationErrors = function() { return [error] };
      validate(req, res, {success: false, "message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, userRoutes.confirm);
      expect(req.calls.checkBody).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isAlphanumeric).toEqual(1);
      expect(req.calls.isLength).toEqual(1);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without an email address', () => {
      let error = [{"param":"email","msg":"A valid email is required."},{"param":"email","msg":"A valid email is required."}];
      req.body = { confirmation_token: 'asdf' };
      req.validationErrors = function() { return [error] };
      validate(req, res, {success: false, "message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, userRoutes.confirm);
      expect(req.calls.checkBody).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isAlphanumeric).toEqual(1);
      expect(req.calls.isLength).toEqual(1);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should error on invalid token', () => {
      let userRoutesFailure = new User({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'config': config, 'UserToken': userToken, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        confirmation_token: 'invalid'
      };
      validate(req, res, { success: false, "message": "Email or token are invalid." }, 400, userRoutesFailure.confirm);
      expect(req.calls.checkBody).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isAlphanumeric).toEqual(1);
      expect(req.calls.isLength).toEqual(1);
      expect(req.calls.isEmail).toEqual(1);
    })

    it('should confirm a user', () => {
      req.body = {
        confirmation_token: 'asdf',
        email: 'testunit@example.com'
      };
      validate(req, res, { success: true, message: 'Confirmation successful.' }, 200, userRoutes.confirm);
      expect(req.calls.checkBody).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isAlphanumeric).toEqual(1);
      expect(req.calls.isLength).toEqual(1);
      expect(req.calls.isEmail).toEqual(1);
      expect(req.calls.validationErrors).toEqual(1);
    });
  });
});