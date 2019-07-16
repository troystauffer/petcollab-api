import Rescue from '../../routes/rescue/rescue';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Rescue', () => {
  let res, req, rescueRoutes, expressValidate = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    rescueRoutes = new Rescue({ db, log, validate: expressValidate });
  })

  describe('listing', () => {
    it('should return a list of rescues', () => {
      let rescues = [{ id: 1, name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' }];
      validateRequest(req, res, { success: true, response: { rescues }}, 200, rescueRoutes.list);
    });
  });

  describe('creation', () => {
    it('should create an rescue', () => {
      let rescue = { name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' };
      req.body = rescue;
      validateRequest(req, res, { success: true, message: 'Rescue created successfully.', response: { rescue: Object.assign({ id: 1 }, rescue) }}, 201, rescueRoutes.create);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "message": "A rescue id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let rescueRoutesFailure = new Rescue({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, rescueRoutesFailure.detail);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { rescue_id: 1 };
      let rescueRoutesFailure = new Rescue({ 'db': dbFailures, 'log': log });
      validateRequest(req, res, {"success":false,"errors":[{"type":"rescue.detail.not_found","message":"No rescue found for provided id."}]}, 404, rescueRoutesFailure.detail);
    });
    it('should display the details of an rescue', () => {
      req.params = { rescue_id: 1 };
      validateRequest(req, res, { success: true, response: { rescue: { id: 1, name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' }}}, 200, rescueRoutes.detail);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { rescue_id: 'asdf' };
      let validationErrors = [{ "param": "id", "message": "A rescue id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let rescueRoutesFailure = new Rescue({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, rescueRoutesFailure.update);
    });
    it('should update an rescue', () => {
      let rescue = { name: 'Test Rescue', street_address: '123 Test St', city: 'Testsville', state: 'TN', zip_code: '12345' };
      req.body = rescue;
      req.params = { rescue_id: 1 };
      validateRequest(req, res, { success: true, message: 'Rescue updated successfully.' }, 201, rescueRoutes.update);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid rescue id', () => {
      req.params = { rescue_id: 1 };
      let rescueRoutesFailure = new Rescue({ 'db': dbFailures, 'log': log });
      validateRequest(req, res, {"success":false,"errors":[{"type":"rescue.delete.not_found","message":"No rescue found for provided id."}]}, 404, rescueRoutesFailure.delete);
    });
    it('should delete an rescue', () => {
      req.params = { rescue_id: 1 };
      validateRequest(req, res, { success: true, response: { message: 'Rescue deleted.' }}, 200, rescueRoutes.delete);
    })
  })
});