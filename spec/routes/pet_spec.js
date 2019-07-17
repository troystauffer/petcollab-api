import Pet from '../../routes/pet/pet';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';
import Crud from '../../lib/crud';

describe('Pet', () => {
  let res, req, petRoutes, expressValidate, crud = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    crud = new Crud({ db: db, validate: expressValidate });
    petRoutes = new Pet({ db, log, validate: expressValidate, crud });
  })

  describe('listing', () => {
    it('should return a list of pets', () => {
      let pets = [
        { id: 1, 'name': 'Test Pet', pet_type_id: 1, comments: 'Good dog.', pet_type: { id: 1, title: 'Dog' }, Transfers: [{ id: 1, pet_id: 1, event_id: 1 }] }
      ];
      validateRequest(req, res, { success: true, response: { pets }}, 200, petRoutes.list);
    });
  });

  describe('creation', () => {
    it('should fail without an pet name', () => {
      let validationErrors = [{ "param": "name", "message": "Name is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let petRoutesFailure = new Pet({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutesFailure.create);
    });
    it('should create a pet', () => {
      let pet = {
        id: 1,
        name: 'Test Pet',
        pet_type_id: 1,
        comments: 'Good dog.'
      };
      req.body = pet;
      validateRequest(req, res, { success: true, message: 'Pet created successfully.', response: { pet: { id: 1, name: 'Test Pet', pet_type_id: 1, comments: 'Good dog.', pet_type: { id: 1, title: 'Dog' }, Transfers: [{ id: 1, pet_id: 1, event_id: 1 }]}}}, 201, petRoutes.create);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "message": "A pet id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let petRoutesFailure = new Pet({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutesFailure.detail);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let crud = new Crud({ db: dbFailures, validate: expressValidate });
      let petRoutesFailure = new Pet({ 'db': dbFailures, log, validate: expressValidate, crud });
      validateRequest(req, res, {"success":false,"errors":[{"type":"pet.detail.not_found","message":"No pet found for provided id."}]}, 404, petRoutesFailure.detail);
    });
    it('should display the details of an pet', () => {
      req.params = { id: 1 };
      validateRequest(req, res, { success: true, response: { pet: { id: 1, name: 'Test Pet', pet_type_id: 1, comments: 'Good dog.', pet_type: { id: 1, title: 'Dog' }, Transfers: [{ id: 1, pet_id: 1, event_id: 1 }]}}}, 200, petRoutes.detail);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { id: 'asdf' };
      req.body = {};
      let validationErrors = [{ "param": "id", "message": "A pet id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let petRoutesFailure = new Pet({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutesFailure.update);
    });
    it('should fail without a pet name', () => {
      req.params = { pet_id: 1 };
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "name", "message": "Name is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let petRoutesFailure = new Pet({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutesFailure.update);
    });
    it('should update an pet', () => {
     let pet = {
        name: 'Test Pet',
        pet_type_id: 1,
        comments: 'Good dog.'
      };
      req.body = pet;
      req.params = { id: 1 };
      validateRequest(req, res, { success: true, message: 'Pet updated successfully.' }, 201, petRoutes.update);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid pet id', () => {
      req.params = { pet_id: 1 };
      let crud = new Crud({ db: dbFailures, validate: expressValidate });
      let petRoutesFailure = new Pet({ 'db': dbFailures, log, crud });
      validateRequest(req, res, {"success":false,"errors":[{"type":"pet.delete.not_found","message":"No pet found for provided id."}]}, 404, petRoutesFailure.delete);
    });
    it('should delete an pet', () => {
      req.params = { pet_id: 1 };
      validateRequest(req, res, { success: true, response: { message: 'Pet deleted.' }}, 200, petRoutes.delete);
    });
  });

  describe('tranferring', () => {
    it('should fail without a pet id', () => {
      let validationErrors = [{ "param": "id", "message": "A pet id is required." }];
      req.params = { event_id: 1 };
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let petRoutesFailure = new Pet({ db, log, validate: expressValidate, crud});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutesFailure.transfer);
    });
    it('should fail without an event id', () => {
      let validationErrors = [{ "param": "id", "message": "An event id is required." }];
      req.params = { pet_id: 1 };
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let petRoutesFailure = new Pet({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutesFailure.transfer);
    });
    it('should return a 404 when given an invalid pet id', () => {
      req.params = { pet_id: 1 };
      let petRoutesFailure = new Pet({ 'db': dbFailures, log, validate: expressValidate, crud });
      validateRequest(req, res, {"success":false,"errors":[{"type":"pet.transfer.not_found","message":"No pet found for provided id."}]}, 404, petRoutesFailure.transfer);
    });
    it('should create a transfer', () => {
      req.params = { pet_id: 1, event_id: 1 };
      validateRequest(req, res, {"success":true,"message":"Transfer created."}, 201, petRoutes.transfer);
    });
  });
});