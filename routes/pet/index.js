class PetRoutes {
  constructor(router, args) {
    const pet = new (require('./pet'))(args);
    router.get('/pets', pet.list);
    router.post('/pets', pet.isAuthorized(['admin', 'super_admin']), pet.create);
  }
}

module.exports = PetRoutes;