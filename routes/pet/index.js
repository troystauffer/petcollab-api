import { check } from 'express-validator';

class PetRoutes {
  constructor(router, args) {
    const pet = new (require('./pet'))(args);
    router.get('/pets', pet.list);
    router.post('/pets', [
      check('name').not().isEmpty().withMessage('Name is required.')
    ], pet.create);
    router.get('/pets/:pet_id', [
      check('pet_id').isNumeric().withMessage('A pet id is required.')
    ], pet.detail);
    router.patch('/pets/:pet_id', [
      check('pet_id').isNumeric().withMessage('A pet id is required.'),
      check('name').not().isEmpty().withMessage('Name is required.')
    ], pet.update);
    router.delete('/pets/:pet_id', [
      check('pet_id').isNumeric().withMessage('A pet id is required.')
    ], pet.delete);
    router.post('/pets/:pet_id/transfer/:event_id', [
      check('pet_id').isNumeric().withMessage('A pet id is required.'),
      check('event_id').isNumeric().withMessage('An event id is required.')
    ], pet.transfer);
  }
}

module.exports = PetRoutes;
