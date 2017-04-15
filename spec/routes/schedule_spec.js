import Schedule from '../../routes/schedule/schedule';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';
import Sequelize from '../../models/';
import Config from '../../config/';

const config = new Config();
const sequelize = new Sequelize(config.database);

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
      let error = [{ "param": "id", "msg": "An event id is required." }];
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.schedules);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a list of schedules', () => {
      let schedules = [
        { 'title': 'Test Schedule 1' },
        { 'title': 'Test Schedule 2' }
      ];
      sequelize.Schedule.bulkCreate(schedules).then((schedules) => {
        validate(req, res, { success: true, response: { schedules }}, 200, scheduleRoutes.schedules);
        expect(req.calls.checkParams).toEqual(1);
        expect(req.calls.notEmpty).toEqual(1);
        expect(req.calls.isNumeric).toEqual(1);
      });
    });
  });

  describe('creation', () => {
    it('should fail without a title', () => {
      req.params = { id: 1 };
      let error = [{ "param": "id", "msg": "Title is required." }];
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an invalid event id', () => {
      req.params = { id: 2 };
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, 'log': log });
      validate(req, res, { success: false, message: 'Invalid event id.' }, 404, scheduleRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should create a schedule', () => {
      req.params = { id: 1 };
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
      let error = [{ "param": "id", "msg": "A schedule id is required." }];
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.schedule);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, 'log': log });
      validate(req, res, { success: false, message: 'No schedule found for provided id.' }, 404, scheduleRoutesFailure.schedule);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should display the details of an event', () => {
      req.params = { id: 1 };
      validate(req, res, { success: true, response: { id: 1, event_id: 1, title: 'Test Schedule' }}, 200, scheduleRoutes.schedule);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      let error = [{ "param": "id", "msg": "A schedule id is required." }];
      req.params = { id: 'asdf' };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should fail without a schedule title', () => {
      let error = [{ "param": "title", "msg": "Title is required." }];
      req.body = {};
      req.validationErrors = function() { return [error] };
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
      req.params = { id: 1 };
      validate(req, res, { success: true, message: 'Schedule updated successfully.' }, 201, scheduleRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(2);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid schedule id', () => {
      req.params = { id: 1 };
      let scheduleRoutesFailure = new Schedule({ 'db': dbFailures, 'log': log });
      validate(req, res, { success: false, message: 'No schedule found for provided id.' }, 404, scheduleRoutesFailure.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should delete a schedule', () => {
      req.params = { id: 1 };
      validate(req, res, { success: true, message: 'Schedule deleted.' }, 200, scheduleRoutes.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    })
  })
});