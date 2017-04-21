import Schedule from '../../routes/schedule/schedule';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Schedule', () => {
  let res = {};
  let req = {};
  let scheduleRoutes = {};
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    scheduleRoutes = new Schedule({ 'db': db, 'log': log });
  })

  describe('listing', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "An event id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.list);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a list of schedules', () => {
      req.params = { schedule_id: 1 };
      let schedules = [{
        id: 1,
        title: 'Test Schedule',
        event_id: 1
      }];
      validate(req, res, { success: true, response: { schedules }}, 200, scheduleRoutes.list);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('creation', () => {
    it('should fail without a title', () => {
      req.params = { event_id: 1 };
      let validationErrors = [{ "param": "title", "msg": "Title is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an invalid event id', () => {
      req.params = { event_id: 2 };
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"schedule.create.not_found","message":"No event found for provided id."}]}, 404, scheduleRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should create a schedule', () => {
      req.params = { event_id: 1 };
      req.body = { title: 'Test Schedule' };
      validate(req, res, { success: true, message: 'Schedule created successfully.', response: { id: 1 }}, 201, scheduleRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "schedule_id", "msg": "A schedule id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { schedule_id: 1 };
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"schedule.detail.not_found","message":"No schedule found for provided id."}]}, 404, scheduleRoutesFailure.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should display the details of a schedule', () => {
      req.params = { schedule_id: 1 };
      validate(req, res, { success: true, response: { id: 1, event_id: 1, title: 'Test Schedule' }}, 200, scheduleRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { schedule_id: 'asdf' };
      let validationErrors = [{ "param": "schedule_id", "msg": "A schedule id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should fail without a schedule title', () => {
      req.body = {};
      let validationErrors = [{ "param": "title", "msg": "Title is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should update a schedule', () => {
      let schedule = {
        title: 'Test Schedule'
      };
      req.body = schedule;
      req.params = { schedule_id: 1 };
      validate(req, res, { success: true, message: 'Schedule updated successfully.' }, 201, scheduleRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid schedule id', () => {
      req.params = { schedule_id: 1 };
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"schedule.delete.not_found","message":"No schedule found for provided id."}]}, 404, scheduleRoutesFailure.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should delete a schedule', () => {
      req.params = { schedule_id: 1 };
      validate(req, res, { success: true, message: 'Schedule deleted.' }, 200, scheduleRoutes.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });
});