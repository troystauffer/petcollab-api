import ScheduleItem from '../../routes/schedule_item/schedule_item';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Schedule item', () => {
  let res, req, scheduleItemRoutes, expressValidate = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    scheduleItemRoutes = new ScheduleItem({ db, log, validate: expressValidate });
  })

  describe('listing', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "A schedule id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleItemRoutesFailure = new ScheduleItem({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleItemRoutesFailure.list);
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
      validateRequest(req, res, { success: true, response: { schedule_items: items }}, 200, scheduleItemRoutes.list);
    });
  });

  describe('creation', () => {
    it('should fail without a schedule id', () => {
      req.params = {};
      let validationErrors = [{ "param": "id", "msg": "Schedule id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleItemRoutesFailure = new ScheduleItem({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleItemRoutesFailure.create);
    });
    it('should return a 404 when provided an invalid schedule id', () => {
      req.params = { id: 2 };
      let scheduleItemRoutesFailure = new ScheduleItem({ 'db': dbFailures, 'log': log });
      validateRequest(req, res, {"success":false,"errors":[{"type":"schedule_item.create.not_found","message":"No schedule found for provided id."}]}, 404, scheduleItemRoutes.create);
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
      validateRequest(req, res, { success: true, message: 'Schedule item created successfully.', response: { schedule_item: Object.assign({ id: 1, schedule_id: 1 }, si)}}, 201, scheduleItemRoutes.create);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "A schedule item id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleItemRoutesFailure = new ScheduleItem({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleItemRoutesFailure.detail);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let scheduleItemRoutesFailure = new ScheduleItem({ 'db': dbFailures, 'log': log });
      validateRequest(req, res, {"success":false,"errors":[{"type":"schedule_item.detail.not_found","message":"No schedule_item found for provided id."}]}, 404, scheduleItemRoutesFailure.detail);
    });
    it('should display the details of an event', () => {
      req.params = { id: 1 };
      validateRequest(req, res, { success: true, response: { schedule_item: { id: 1, title: "Test Schedule Item", schedule_id: 1, assigned_user_id: 1, starts_at: "2017-04-15T12:00:00.000Z", ends_at: "2017-04-16T12:00:00.000Z", order: 1 }}}, 200, scheduleItemRoutes.detail);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { id: 'asdf' };
      let validationErrors = [{ "param": "id", "msg": "A schedule item id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let scheduleItemRoutesFailure = new ScheduleItem({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, scheduleItemRoutesFailure.update);
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
      validateRequest(req, res, { success: true, message: 'Schedule item updated successfully.' }, 201, scheduleItemRoutes.update);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid schedule item id', () => {
      req.params = { id: 1 };
      let scheduleItemRoutesFailure = new ScheduleItem({ 'db': dbFailures, 'log': log });
      validateRequest(req, res, {"success":false,"errors":[{"type":"schedule_item.delete.not_found","message":"No schedule_item found for provided id."}]}, 404, scheduleItemRoutesFailure.delete);
    });
    it('should delete a schedule item', () => {
      req.params = { id: 1 };
      validateRequest(req, res, { success: true, response: { message: 'Schedule Item deleted.' }}, 200, scheduleItemRoutes.delete);
    })
  });
});
