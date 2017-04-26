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
      validate(req, res, { success: true, response: { user: {user_id: 1} }}, 200, userRoutes.info);
    });

    it('should return a well formed error', () => {
      validate(req, res, { success: false, errors: [{ type: 'user.error', message: 'An error occurred.' }]}, 400, userRoutes.error);
    });

    it('should return the user fields', () => {
      validate(req, res, { success: true, response: {fields: userDescribe}}, 200, userRoutes.fields);
    });
  });

  describe('creation', () => {
    it('should fail without email', () => {
      req.body = {
        password: 'password',
        name: 'Test Unit'
      };
      let validationErrors = [{ "param": "email", "msg": "Email is required." }, { "param": "email", "msg": "Email must be a valid email address." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without password', () => {
      req.body = {
        email: 'testunit@example.com',
        name: 'Test Unit'
      };
      let validationErrors = { "param": "password", "msg": "Password is required." };
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without name', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      let validationErrors = { "param": "name", "msg": "Name is required." };
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", "errors": [error]}, 400, userRoutes.create);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without a valid email', () => {
      req.body = {
        email: 'testunit',
        password: 'password',
        name: 'Test Unit'
      };
      let validationErrors = { "param": "email", "msg": "Email must be a valid email address." };
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
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
      validate(req, res, {"success":false,"errors":[{"type":"user.create.email.exists","message":"User with this email already exists."}]}, 400, userRoutesFailure.create);
      expect(pwcrypt.calls.secureHash).toEqual(1);
      expect(req.calls.checkBody).toEqual(4);
      expect(req.calls.notEmpty).toEqual(3);
      expect(req.calls.isEmail).toEqual(1);
      expect(req.calls.validationErrors).toEqual(1);
    });
  });

  describe('confirmation', () => {
    it('should fail without a confirmation token', () => {
      req.body = { email: 'testunit@example.com' };
      let validationErrors = {"param":"confirmation_token","msg":"A valid confirmation token is required."};
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, {success: false, "message":"The data provided to the API was invalid or incomplete.","errors":[error]}, 400, userRoutes.confirm);
      expect(req.calls.checkBody).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isAlphanumeric).toEqual(1);
      expect(req.calls.isLength).toEqual(1);
      expect(req.calls.isEmail).toEqual(1);
    });

    it('should fail without an email address', () => {
      req.body = { confirmation_token: 'asdf' };
      let validationErrors = [{"param":"email","msg":"A valid email is required."},{"param":"email","msg":"A valid email is required."}];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
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
      validate(req, res, { success: false, errors: [{ type: 'user.confirm.params.invalid', message: 'Email or token are invalid.' }]}, 400, userRoutesFailure.confirm);
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