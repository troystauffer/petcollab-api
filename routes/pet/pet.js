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
        let petType = '';
        if (pet.PetType) petType = pet.PetType.title;
        response.push({ id: pet.id, name: pet.name, pet_type_id: pet.pet_type_id, pet_type: petType, comments: pet.comments })
      })
      return res.status(200).json(new RO({ success: true, response: response }));
    });
  }

  create(req, res) {
    req.checkBody('name', 'Name is required.').notEmpty();
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

  detail(req, res) {
    req.checkParams('pet_id', 'A pet id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Pet.findById(req.params.pet_id, { include: [ _this.db.PetType ]}).then((pet) => {
      if (!pet) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'pet.detail.not_found', message: 'No pet found for provided id.' })]}));
      _this.log.info('Detailing pet ' + req.params.pet_id + ' for user ' + req.user.email);
      let petType = '';
      if (pet.PetType) petType = pet.PetType.title;
      return res.status(200).json(new RO({ success: true, response: { id: pet.id, name: pet.name, pet_type_id: pet.pet_type_id, pet_type: petType, comments: pet.comments }}));
    })
  }

  update(req, res) {
    req.checkParams('pet_id', 'An pet id is required.').notEmpty().isNumeric();
    req.checkBody('name', 'Name is required.').notEmpty();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    let pet_type = {};
    if (req.body.pet_type) pet_type = _.find(_this.types, ['title', req.body.pet_type]);
    if (req.body.pet_type_id) pet_type = _.find(_this.types, (t) => { return t.id == req.body.pet_type_id; });
    if (typeof pet_type == 'undefined') pet_type = _.find(_this.types, ['title', 'Dog']);
    _this.db.Pet.findById(req.params.pet_id)
    .then((pet) => {
      if (!pet) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'pet.update.not_found', message: 'No pet found for provided id.' })]}));
      pet.update({
        name: req.body.name,
        pet_type_id: pet_type.id,
        comments: req.body.comments
      }).then((pet) => {
        _this.log.info('Updated pet ' + pet.title + ', id: ' + pet.id + ' for user ' + req.user.email);
        return res.status(201).json(new RO({ success: true, message: 'Pet updated successfully.' }));
      });
    });
  }

  delete(req, res) {
    req.checkParams('pet_id', 'A pet id is required.').notEmpty().isNumeric();
    if (req.validationErrors()) return super.validationErrorResponse(res, req.validationErrors());
    _this.db.Pet.findById(req.params.pet_id)
    .then((pet) => {
      if (!pet) return res.status(404).json(new RO({ success: false, errors: [new ApiError({ type: 'pet.delete.not_found', message: 'No pet found for provided id.' })]}));
      pet.destroy();
      _this.log.info('Deleted pet ' + req.params.pet_id + ' for user ' + req.user.email);
      return res.status(200).json(new RO({ success: true, message: 'Pet deleted.' }));
    });
  }
}

module.exports = Pet;