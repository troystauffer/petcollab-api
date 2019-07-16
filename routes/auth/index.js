import { check } from 'express-validator';

class AuthRoutes {
  constructor(router, args) {
    const auth = new (require('./auth'))(args);
    router.post('/auth', [
      check('email').not().isEmpty().withMessage('Email is required.'),
      check('email').isEmail().withMessage('Email must be a valid email address.'),
      check('password').not().isEmpty().withMessage('Password is required.')
    ], auth.authenticate);
  }
}

module.exports = AuthRoutes;