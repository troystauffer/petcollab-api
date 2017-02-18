import path from 'path';
import User from '../../routes/user/user';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import pwcrypt from '../util/pwcrypt';
import UserToken from '../util/user_token';
import log from '../util/log';

describe('User', () => {
  let res = {};
  let req = {};
  let userRoutes = {};
  const config = { 'confirmationTokenLength': 6 };
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    userRoutes = new User({ 'db': db, 'pwcrypt': pwcrypt, 'config': config, 'UserToken': UserToken, 'log': log });
  })

  it('should return user info', () => {
    validate(req, res, { user: { user_id: 1 }}, 200, userRoutes.info);
  });

  it('should return a well formed error', () => {
    validate(req, res, { message: 'An error occurred.' }, 400, userRoutes.error);
  });

  it('should return the user fields', () => {
    validate(req, res, userDescribe, 200, userRoutes.fields);
  });

  it('should fail user creation without email', () => {
    req.body = {
      password: 'password',
      name: 'Test Unit'
    };
    validate(req, res, { "message": "The data provided to the API was invalid or incomplete.", "errors": [{ "param": "email", "msg": "Email is required." }, { "param": "email", "msg": "Email must be a valid email address." }]}, 400, userRoutes.create);
  });

  it('should fail user creation without password', () => {
    req.body = {
      email: 'testunit@example.com',
      name: 'Test Unit'
    };
    validate(req, res, { "message": "The data provided to the API was invalid or incomplete.", "errors": [{ "param": "password", "msg": "Password is required." }]}, 400, userRoutes.create);
  });

  it('should fail user creation without name', () => {
    req.body = {
      email: 'testunit@example.com',
      password: 'password'
    };
    validate(req, res, { "message": "The data provided to the API was invalid or incomplete.", "errors": [{ "param": "name", "msg": "Name is required." }]}, 400, userRoutes.create);
  });

  it('should fail user creation without a valid email', () => {
    req.body = {
      email: 'testunit',
      password: 'password',
      name: 'Test Unit'
    };
    validate(req, res, { "message": "The data provided to the API was invalid or incomplete.", "errors": [{ "param": "email", "msg": "Email must be a valid email address." }]}, 400, userRoutes.create);
  });

});