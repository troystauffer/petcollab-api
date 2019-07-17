import { check } from 'express-validator';

class UserRoutes {
  constructor(router, args) {
    const user = new (require('./user'))(args);
    router.get('/users/info.:format?', user.info);
    router.get('/users/error.:format?', user.error);
    router.post('/users.:format?', [
      check('email').not().isEmpty().withMessage('Email is required.'),
      check('email').isEmail().withMessage('Email must be a valid email address.'),
      check('password').not().isEmpty().withMessage('A valid password is required.'),
      check('name').not().isEmpty().withMessage('A valid name is required.')
    ], user.createUser);
    router.post('/users/confirm.:format?', [
      check('confirmation_token').not().isEmpty().withMessage('A valid confirmation token is required.'),
      check('confirmation_token').isAlphanumeric().isLength(args.config.confirmationTokenLength)
        .withMessage('A valid confirmation token is required.'),
      check('email').isEmail().withMessage('A valid email is required.'),
      check('email').not().isEmpty().withMessage('A valid email is required.')
    ], user.confirm);
    router.patch('/users.:format?', user.update);
    router.get('/admin/users.:format?', user.list);
    router.delete('/admin/users/:user_id.:format?', [
      check('user_id').isNumeric().withMessage('User id must be numeric')
    ], user.delete);
  }
}

module.exports = UserRoutes;
