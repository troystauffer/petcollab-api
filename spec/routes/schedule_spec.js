import Schedule from '../../routes/schedule/schedule';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';
import Crud from '../../lib/crud';

describe('Schedule', () => {
  let res, req, scheduleRoutes, expressValidate, crud = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    crud = new Crud({ db: db, validate: expressValidate });
    scheduleRoutes = new Schedule({ db, log, validate: expressValidate, crud });
  })

  describe('listing', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "message": "An event id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleRoutesFailure = new Schedule({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleRoutesFailure.list);
    });
    it('should return a list of schedules', () => {
      req.params = { schedule_id: 1 };
      let schedules = [{
        id: 1,
        title: 'Test Schedule',
        event_id: 1
      }];
      validateRequest(req, res, { success: true, response: { schedules }}, 200, scheduleRoutes.list);
    });
  });

  describe('creation', () => {
    it('should fail without a title', () => {
      req.params = { event_id: 1 };
      let validationErrors = [{ "param": "title", "message": "Title is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleRoutesFailure = new Schedule({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleRoutesFailure.create);
    });
    it('should return a 404 when provided an invalid event id', () => {
      req.params = { event_id: 2 };
      let crud = new Crud({ db: dbFailures, validate: expressValidate });
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, log, crud });
      validateRequest(req, res, {"success":false,"errors":[{"type":"schedule.create.not_found","message":"No event found for provided id."}]}, 404, scheduleRoutes.create);
    });
    it('should create a schedule', () => {
      req.params = { event_id: 1 };
      req.body = { title: 'Test Schedule' };
      validateRequest(req, res, { success: true, message: 'Schedule created successfully.', response: { schedule: { id: 1, title: 'Test Schedule', event_id: 1 }}}, 201, scheduleRoutes.create);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "schedule_id", "message": "A schedule id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let crud = new Crud({ db: dbFailures, validate: expressValidate });
      let scheduleRoutesFailure = new Schedule({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleRoutesFailure.detail);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { schedule_id: 1 };
      let crud = new Crud({ db: dbFailures, validate: expressValidate });
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, log, crud });
      validateRequest(req, res, {"success":false,"errors":[{"type":"schedule.detail.not_found","message":"No schedule found for provided id."}]}, 404, scheduleRoutesFailure.detail);
    });
    it('should display the details of a schedule', () => {
      req.params = { schedule_id: 1 };
      validateRequest(req, res, { success: true, response: { schedule: { id: 1, event_id: 1, title: 'Test Schedule' }}}, 200, scheduleRoutes.detail);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { schedule_id: 'asdf' };
      let validationErrors = [{ "param": "schedule_id", "message": "A schedule id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleRoutesFailure = new Schedule({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleRoutesFailure.update);
    });
    it('should fail without a schedule title', () => {
      req.body = {};
      let validationErrors = [{ "param": "title", "message": "Title is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleRoutesFailure = new Schedule({ db, log, validate: expressValidate, crud });
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleRoutesFailure.update);
    });
    it('should update a schedule', () => {
      let schedule = {
        title: 'Test Schedule'
      };
      req.body = schedule;
      req.params = { schedule_id: 1 };
      validateRequest(req, res, { success: true, message: 'Schedule updated successfully.' }, 201, scheduleRoutes.update);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid schedule id', () => {
      req.params = { schedule_id: 1 };
      let crud = new Crud({ db: dbFailures, validate: expressValidate });
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, log, crud });
      validateRequest(req, res, {"success":false,"errors":[{"type":"schedule.delete.not_found","message":"No schedule found for provided id."}]}, 404, scheduleRoutesFailure.delete);
    });
    it('should delete a schedule', () => {
      req.params = { schedule_id: 1 };
      validateRequest(req, res, { success: true, response: { message: 'Schedule deleted.' }}, 200, scheduleRoutes.delete);
    });
  });
});
