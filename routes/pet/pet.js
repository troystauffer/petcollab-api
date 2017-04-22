import BaseRoute from '../base_route';
import RO from '../../lib/response_object';
import ApiError from '../../lib/api_error';
import _ from 'lodash';

let _this = {};

class Pet extends BaseRoute{
  constructor(args = {}) {
    super(args);
    Object.keys(args).map((key) => { _this[key] = args[key]; });
    _this.db.PetType.findAll().then((types) => {
      _this.types = types;
    });
  }

  list(req, res) {
    _this.db.Pet.findAll({ include: [ _this.db.PetType ], order: [['created_at', 'DESC']] })
    .then((pets) => {
      _this.log.info('Listing all pets for user ' + req.user.email);
      let response = [];
      pets.forEach((pet) => {
        response.push({ id: pet.id, name: pet.name, pet_type_id: pet.pet_type_id, pet_type: pet.PetType.title, comments: pet.comments })
      })
      return res.status(200).json(new RO({ success: true, response: response }));
    });
  }

  create(req, res) {
    req.checkBody('name', 'Title is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    let pet_type = {};
    if (req.body.pet_type) pet_type = _.find(_this.types, ['title', req.body.pet_type]);
    if (req.body.pet_type_id) pet_type = _.find(_this.types, (t) => { return t.id == req.body.pet_type_id; });
    if (typeof pet_type == 'undefined') pet_type = _.find(_this.types, ['title', 'Dog']);
    _this.db.Pet.create({
      name: req.body.name,
      pet_type_id: pet_type.id,
      comments: req.body.comments
    }).then((pet) => {
      _this.log.info('Created new pet ' + pet.name + ', id: ' + pet.id + ' for user ' + req.user.email);
      return res.status(201).json(new RO({ success: true, message: 'Pet created successfully.', response: { id: pet.id }}));
    })
  }
}

module.exports = Pet;