import Pet from '../../routes/pet/pet';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Pet', () => {
  let res = {};
  let req = {};
  let petRoutes = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    petRoutes = new Pet({ 'db': db, 'log': log });
  })

  describe('listing', () => {
    it('should return a list of pets', () => {
      let pets = [
        { id: 1, 'name': 'Test Pet', pet_type_id: 1, comments: 'Good dog.', pet_type: { id: 1, title: 'Dog' }, Transfers: [{ id: 1, pet_id: 1, event_id: 1 }] }
      ];
      validate(req, res, { success: true, response: { pets }}, 200, petRoutes.list);
    });
  });

  describe('creation', () => {
    it('should fail without an pet name', () => {
      let validationErrors = [{ "param": "name", "msg": "Name is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutes.create);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
    });
    it('should create a pet', () => {
      let pet = {
        id: 1,
        name: 'Test Pet',
        pet_type_id: 1,
        comments: 'Good dog.'
      };
      req.body = pet;
      validate(req, res, { success: true, message: 'Pet created successfully.', response: { pet: { id: 1, name: 'Test Pet', pet_type_id: 1, comments: 'Good dog.', pet_type: { id: 1, title: 'Dog' }, Transfers: [{ id: 1, pet_id: 1, event_id: 1 }]}}}, 201, petRoutes.create);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "A pet id is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let petRoutesFailure = new Pet({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"pet.detail.not_found","message":"No pet found for provided id."}]}, 404, petRoutesFailure.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should display the details of an pet', () => {
      req.params = { id: 1 };
      validate(req, res, { success: true, response: { pet: { id: 1, name: 'Test Pet', pet_type_id: 1, comments: 'Good dog.', pet_type: { id: 1, title: 'Dog' }, Transfers: [{ id: 1, pet_id: 1, event_id: 1 }]}}}, 200, petRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { id: 'asdf' };
      req.body = {};
      let validationErrors = [{ "param": "id", "msg": "A pet id is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should fail without a pet name', () => {
      req.params = { pet_id: 1 };
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "name", "msg": "Name is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should update an pet', () => {
     let pet = {
        name: 'Test Pet',
        pet_type_id: 1,
        comments: 'Good dog.'
      };
      req.body = pet;
      req.params = { id: 1 };
      validate(req, res, { success: true, message: 'Pet updated successfully.' }, 201, petRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid pet id', () => {
      req.params = { pet_id: 1 };
      let petRoutesFailure = new Pet({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"pet.delete.not_found","message":"No pet found for provided id."}]}, 404, petRoutesFailure.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should delete an pet', () => {
      req.params = { pet_id: 1 };
      validate(req, res, { success: true, response: { message: 'Pet deleted.' }}, 200, petRoutes.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('tranferring', () => {
    it('should fail without a pet id', () => {
      let validationErrors = [{ "param": "id", "msg": "A pet id is required." }];
      req.params = { event_id: 1 };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutes.transfer);
      expect(req.calls.checkParams).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(2);
    });
    it('should fail without an event id', () => {
      let validationErrors = [{ "param": "id", "msg": "An event id is required." }];
      req.params = { pet_id: 1 };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, petRoutes.transfer);
      expect(req.calls.checkParams).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(2);
    });
    it('should return a 404 when given an invalid pet id', () => {
      req.params = { pet_id: 1 };
      let petRoutesFailure = new Pet({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"pet.transfer.not_found","message":"No pet found for provided id."}]}, 404, petRoutesFailure.transfer);
      expect(req.calls.checkParams).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(2);
    });
    it('should create a transfer', () => {
      req.params = { pet_id: 1, event_id: 1 };
      validate(req, res, {"success":true,"message":"Transfer created."}, 201, petRoutes.transfer);
      expect(req.calls.checkParams).toEqual(2);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(2);
    });
  });
});