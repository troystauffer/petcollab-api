import ScheduleItem from '../../routes/schedule_item/schedule_item';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Schedule item', () => {
  let res = {};
  let req = {};
  let scheduleItemRoutes = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    scheduleItemRoutes = new ScheduleItem({ 'db': db, 'log': log });
  })

  describe('listing', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "A schedule id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleItemRoutes.list);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a list of schedule items', () => {
      req.params = { schedule_id: 1 }
      let items = [{
        id: 1,
        title: 'Test Schedule Item',
        assigned_user_id: 1,
        schedule_id: 1,
        starts_at: '2017-04-15T12:00:00.000Z',
        ends_at: '2017-04-16T12:00:00.000Z',
        order: 1
      }];
      validate(req, res, { success: true, response: { schedule_items: items }}, 200, scheduleItemRoutes.list);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('creation', () => {
    it('should fail without a schedule id', () => {
      req.params = {};
      let validationErrors = [{ "param": "id", "msg": "Schedule id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleItemRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(2);
    });
    it('should return a 404 when provided an invalid schedule id', () => {
      req.params = { id: 2 };
      let scheduleItemRoutesFailure = new ScheduleItem({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"schedule_item.create.not_found","message":"No schedule found for provided id."}]}, 404, scheduleItemRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(2);
    });
    it('should create a schedule item', () => {
      req.params = { id: 1 };
      let si = {
        title: 'Test Schedule Item',
        assigned_user_id: 1,
        order: 1,
        starts_at: '2017-04-15T12:00:00.000Z',
        ends_at: '2017-04-16T12:00:00.000Z'
      };
      req.body = si;
      validate(req, res, { success: true, message: 'Schedule item created successfully.', response: { schedule_item: Object.assign({ id: 1, schedule_id: 1 }, si)}}, 201, scheduleItemRoutes.create);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(2);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "A schedule item id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleItemRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let scheduleItemRoutesFailure = new ScheduleItem({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"schedule_item.detail.not_found","message":"No schedule_item found for provided id."}]}, 404, scheduleItemRoutesFailure.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should display the details of an event', () => {
      req.params = { id: 1 };
      validate(req, res, { success: true, response: { schedule_item: { id: 1, title: "Test Schedule Item", schedule_id: 1, assigned_user_id: 1, starts_at: "2017-04-15T12:00:00.000Z", ends_at: "2017-04-16T12:00:00.000Z", order: 1 }}}, 200, scheduleItemRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { id: 'asdf' };
      let validationErrors = [{ "param": "id", "msg": "A schedule item id is required." }];
      let error = { type: 'api.params.invalid', validation: validationErrors };
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, scheduleItemRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should update a schedule item', () => {
      req.params = { id: 1 };
      req.body = {
        title: 'Test Item',
        assigned_user_id: 1,
        order: 1,
        starts_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      validate(req, res, { success: true, message: 'Schedule item updated successfully.' }, 201, scheduleItemRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid schedule item id', () => {
      req.params = { id: 1 };
      let scheduleItemRoutesFailure = new ScheduleItem({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"schedule_item.delete.not_found","message":"No schedule_item found for provided id."}]}, 404, scheduleItemRoutesFailure.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should delete a schedule item', () => {
      req.params = { id: 1 };
      validate(req, res, { success: true, response: { message: 'Schedule Item deleted.' }}, 200, scheduleItemRoutes.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    })
  });
});
