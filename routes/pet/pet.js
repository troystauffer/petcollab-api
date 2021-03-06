import BaseRoute from '../base_route';
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
    _this.db.Pet.findAll({
      include: [ _this.db.PetType, _this.db.Transfer ], order: [['created_at', 'DESC']]
    }).then((pets) => {
      _this.log.info('Listing all pets for user ' + req.user.email);
      return res.status(200).json({ success: true, response: { pets }});
    });
  }

  create(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    let pet_type = {};
    if (req.body.pet_type) pet_type = _.find(_this.types, ['title', req.body.pet_type]);
    if (req.body.pet_type_id) pet_type = _.find(_this.types, (t) => { return t.id == req.body.pet_type_id; });
    if (typeof pet_type == 'undefined' || _.isEmpty(pet_type)) pet_type = _.find(_this.types, ['title', 'Dog']);
    _this.db.Pet.create({
      name: req.body.name,
      pet_type_id: pet_type.id,
      comments: req.body.comments
    }).then((pet) => {
      _this.log.info('Created new pet ' + pet.name + ', id: ' + pet.id + ' for user ' + req.user.email);
      return res.status(201).json({ success: true, message: 'Pet created successfully.', response: {pet}});
    });
  }

  detail(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Pet.findByPk(req.params.pet_id, { include: [ _this.db.PetType, _this.db.Transfer ]}).then((pet) => {
      if (!pet) return res.status(404).json({ success: false, errors: [{
        type: 'pet.detail.not_found',
        message: 'No pet found for provided id.'
      }]});
      _this.log.info('Detailing pet ' + req.params.pet_id + ' for user ' + req.user.email);
      return res.status(200).json({ success: true, response: { pet: pet }});
    });
  }

  update(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Pet.findByPk(req.params.pet_id).then((pet) => {
      if (!pet) return res.status(404).json({ success: false, errors: [{
        type: 'pet.update.not_found',
        message: 'No pet found for provided id.'
      }]});
      let pet_type = {};
      if (req.body.pet_type) pet_type = _.find(_this.types, ['title', req.body.pet_type]);
      if (req.body.pet_type_id) pet_type = _.find(_this.types, (t) => { return t.id == req.body.pet_type_id; });
      if (typeof pet_type == 'undefined' || _.isEmpty(pet_type)) pet_type = pet.pet_type;
      pet.update({
        name: req.body.name || pet.name,
        pet_type_id: pet_type.id,
        comments: req.body.comments || pet.comments
      }).then((pet) => {
        _this.log.info('Updated pet ' + pet.title + ', id: ' + pet.id + ' for user ' + req.user.email);
        return res.status(201).json({ success: true, message: 'Pet updated successfully.' });
      });
    });
  }

  delete(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.crud.delete({ classname: 'Pet', req: req, res: res });
  }

  transfer(req, res) {
    const errors = _this.validate(req);
    if (!errors.isEmpty()) return super.validationErrorResponse(res, errors.array());
    _this.db.Pet.findByPk(req.params.pet_id).then((pet) => {
      if (!pet) return res.status(404).json({ success: false, errors: [{
        type: 'pet.transfer.not_found',
        message: 'No pet found for provided id.'
      }]});
      _this.db.Event.findByPk(req.params.event_id).then((event) => {
        if (!event) return res.status(404).json({ success: false, errors: [{
          type: 'pet.transfer.not_found',
          message: 'No event found for provided id.'
        }]});
        _this.db.Transfer.findOne({ where: { pet_id: req.params.pet_id }}).then((transfer) => {
          if (transfer) return transfer.destroy();
        }).then(() => {
          _this.db.Transfer.create({
            pet_id: req.params.pet_id,
            event_id: req.params.event_id
          }).then(() => {
            return res.status(201).json({ success: true, message: 'Transfer created.' });
          });
        });
      });
    });
  }
}

module.exports = Pet;
