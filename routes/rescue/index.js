import { check } from 'express-validator';

class RescueRoutes {
  constructor(router, args) {
    const rescue = new (require('./rescue'))(args);
    router.get('/rescues', rescue.list);
    router.get('/rescues/:rescue_id', [
      check('rescue_id').isNumeric().withMessage('A rescue id is required.')
    ], rescue.detail);
    router.post('/rescues', [
      check('name').not().isEmpty().withMessage('A name is required'),
      check('street_address').not().isEmpty().withMessage('A street address is required'),
      check('city').not().isEmpty().withMessage('A city is required'),
      check('state').not().isEmpty().withMessage('A state is required'),
      check('zip_code').not().isEmpty().withMessage('A zip_code is required')
    ], rescue.create);
    router.patch('/rescues/:rescue_id', [
      check('rescue_id').isNumeric().withMessage('A rescue id is required.')
    ], rescue.update);
    router.delete('/rescues/:rescue_id', [
      check('rescue_id').isNumeric().withMessage('A rescue id is required.')
    ], rescue.delete);
  }
}

module.exports = RescueRoutes;
