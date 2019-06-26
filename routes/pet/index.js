class PetRoutes {
  constructor(router, args) {
    const pet = new (require('./pet'))(args);
    router.get('/pets', pet.list);
    router.post('/pets', pet.create);
    router.get('/pets/:pet_id', pet.detail);
    router.patch('/pets/:pet_id', pet.update);
    router.delete('/pets/:pet_id', pet.delete);
    router.post('/pets/:pet_id/transfer/:event_id', pet.transfer);
  }
}

module.exports = PetRoutes;
