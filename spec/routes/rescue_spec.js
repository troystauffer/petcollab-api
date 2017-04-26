import Rescue from '../../routes/rescue/rescue';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Rescue', () => {
  let res = {};
  let req = {};
  let rescueRoutes = {};
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    rescueRoutes = new Rescue({ 'db': db, 'log': log });
  })

  describe('listing', () => {
    xit('should return a list of rescues', () => {
      let rescues = [{ id: 1, name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' }];
      validate(req, res, { success: true, response: rescues}, 200, rescueRoutes.list);
    });
  });

  describe('creation', () => {
    xit('should create an rescue', () => {
      let rescue = { name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' };
      req.body = rescue;
      validate(req, res, { success: true, message: 'Rescue created successfully.', response: Object.assign({ id: 1 }, rescue) }, 201, rescueRoutes.create);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "A rescue id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, rescueRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { rescue_id: 1 };
      let rescueRoutesFailure = new Rescue({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"rescue.detail.not_found","message":"No rescue found for provided id."}]}, 404, rescueRoutesFailure.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    xit('should display the details of an rescue', () => {
      req.params = { rescue_id: 1 };
      validate(req, res, { success: true, response: { id: 1, name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' }}, 200, rescueRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { rescue_id: 'asdf' };
      let validationErrors = [{ "param": "id", "msg": "A rescue id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, rescueRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    xit('should update an rescue', () => {
      let rescue = { name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' };
      req.body = rescue;
      req.params = { rescue_id: 1 };
      validate(req, res, { success: true, message: 'Rescue updated successfully.' }, 201, rescueRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid rescue id', () => {
      req.params = { rescue_id: 1 };
      let rescueRoutesFailure = new Rescue({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"rescue.delete.not_found","message":"No rescue found for provided id."}]}, 404, rescueRoutesFailure.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    xit('should delete an rescue', () => {
      req.params = { rescue_id: 1 };
      validate(req, res, { success: true, message: 'Rescue deleted.' }, 200, rescueRoutes.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    })
  })
});