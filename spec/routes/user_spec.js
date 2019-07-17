import path from 'path';
import UserRoutes from '../../routes/user/user';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import Pwcrypt from '../util/pwcrypt';
import UserToken from '../util/user_token';
import log from '../util/log';
import Crud from '../../lib/crud';

describe('User', () => {
  let res, req, userRoutes, pwcrypt, userToken, expressValidate, crud = {};
  const config = { 'confirmationTokenLength': 6 };

  beforeEach(() => {
    res = new Res();
    req = new Req();
    pwcrypt = new Pwcrypt();
    userToken = new UserToken();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    crud = new Crud({ db: db, validate: expressValidate });
    userRoutes = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
  })

  describe('misc endpoints', () => {
    it('should return user info', () => {
      validateRequest(req, res, { success: true, response: { user: { id: 1, Role: { id: 1, title: "user" }}}}, 200, userRoutes.info);
    });

    it('should return a well formed error', () => {
      validateRequest(req, res, { success: false, errors: [{ type: 'user.error', message: 'An error occurred.' }]}, 400, userRoutes.error);
    });
  });

  describe('creation', () => {
    it('should fail without email', () => {
      req.body = {
        password: 'password',
        name: 'Test Unit'
      };
      let validationErrors = [{ "param": "email", "message": "Email is required." }, { "param": "email", "message": "Email must be a valid email address." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let userRoutesFailure = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", errors: validationErrors}, 400, userRoutesFailure.create);
    });

    it('should fail without password', () => {
      req.body = {
        email: 'testunit@example.com',
        name: 'Test Unit'
      };
      let validationErrors = { "param": "password", "message": "Password is required." };
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let userRoutesFailure = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", errors: validationErrors}, 400, userRoutesFailure.create);
    });

    it('should fail without name', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password'
      };
      let validationErrors = { "param": "name", "message": "Name is required." };
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let userRoutesFailure = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", errors: validationErrors}, 400, userRoutesFailure.create);
    });

    it('should fail without a valid email', () => {
      req.body = {
        email: 'testunit',
        password: 'password',
        name: 'Test Unit'
      };
      let validationErrors = { "param": "email", "message": "Email must be a valid email address." };
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let userRoutesFailure = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, "message": "The data provided to the API was invalid or incomplete.", errors: validationErrors}, 400, userRoutesFailure.create);
    });

    it('should create a user', () => {
      req.body = {
        email: 'testunit@example.com',
        password: 'password',
        name: 'Test Unit'
      };
      validateRequest(req, res, { success: true, "message": "Account created successfully." }, 201, userRoutes.createUser);
    });

    it('should prevent duplicate email addresses', () => {
      let userRoutesFailure = new UserRoutes({ 'db': dbFailures, pwcrypt, config, UserToken, log, validate: expressValidate, crud });
      req.body = {
        email: 'duplicate@example.com',
        password: 'password',
        name: 'Test Unit'
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"user.create.email.exists","message":"User with this email already exists."}]}, 400, userRoutesFailure.create);
    });
  });

  describe('editing', () => {
    it('should update a user', () => {
      let user = {
        name: 'Update Name',
        password: 'password'
      };
      req.body = user;
      validateRequest(req, res, { success: true, message: 'Account updated successfully.' }, 201, userRoutes.update);
    });
  });

  describe('admin', () => {
    describe('user list', () => {
      it('should fail for a non-admin user', () => {
        let standardUserDb = Object.assign({}, db);
        standardUserDb.User = standardUserDb.StandardUser;
        let standardUserRoutes = new UserRoutes({ 'db': standardUserDb, pwcrypt, config, UserToken, log, validate: expressValidate, crud });
        validateRequest(req, res, {success: false, "message":"Not authorized to view this resource."}, 403, standardUserRoutes.list);
      });

      it('should work for a super admin user', () => {
        let superAdminUserDb = Object.assign({}, db);
        superAdminUserDb.User = superAdminUserDb.SuperAdminUser;
        let superAdminUserRoutes = new UserRoutes({ 'db': superAdminUserDb, pwcrypt, config, UserToken, log, validate: expressValidate, crud });
        validateRequest(req, res, {success: true, response: [{ id: 1 }]}, 200, superAdminUserRoutes.list);
      });
    });
  });

  describe('confirmation', () => {
    it('should fail without a confirmation token', () => {
      req.body = { email: 'testunit@example.com' };
      let validationErrors = {"param":"confirmation_token","message":"A valid confirmation token is required."};
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let userRoutesFailure = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
      validateRequest(req, res, {success: false, "message":"The data provided to the API was invalid or incomplete.",errors: validationErrors}, 400, userRoutesFailure.confirm);
    });

    it('should fail without an email address', () => {
      req.body = { confirmation_token: 'asdf' };
      let validationErrors = [{"param":"email","message":"A valid email is required."},{"param":"email","message":"A valid email is required."}];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let userRoutesFailure = new UserRoutes({ db, pwcrypt, config, UserToken: userToken, log, validate: expressValidate, crud });
      validateRequest(req, res, {success: false, "message":"The data provided to the API was invalid or incomplete.",errors: validationErrors}, 400, userRoutesFailure.confirm);
    });

    it('should error on invalid token', () => {
      let userRoutesFailure = new UserRoutes({ 'db': dbFailures, 'pwcrypt': pwcrypt, 'config': config, 'UserToken': userToken, 'log': log });
      req.body = {
        email: 'testunit@example.com',
        confirmation_token: 'invalid'
      };
      validateRequest(req, res, { success: false, errors: [{ type: 'user.confirm.params.invalid', message: 'Email or token are invalid.' }]}, 400, userRoutesFailure.confirm);
    })

    it('should confirm a user', () => {
      req.body = {
        confirmation_token: 'asdf',
        email: 'testunit@example.com'
      };
      validateRequest(req, res, { success: true, message: 'Confirmation successful.' }, 200, userRoutes.confirm);
    });
  });
});
