class PetRoutes {
  constructor(router, args) {
    const pet = new (require('./pet'))(args);
    router.get('/pets', pet.list);
    router.post('/pets', pet.isAuthorized(['admin', 'super_admin']), pet.create);
    router.get('/pets/:pet_id', pet.detail);
    router.post('/pets/:pet_id', pet.isAuthorized(['admin', 'super_admin']), pet.update);
    router.delete('/pets/:pet_id', pet.isAuthorized(['admin', 'super_admin']), pet.delete);
  }
}

module.exports = PetRoutes;