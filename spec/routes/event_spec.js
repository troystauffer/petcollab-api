import Event from '../../routes/event/event';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Event', () => {
  let res = {};
  let req = {};
  let eventRoutes = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    eventRoutes = new Event({ 'db': db, 'log': log });
  })

  describe('listing', () => {
    it('should return a list of events', () => {
      let events = [
        { id: 1, 'title': 'Test Event', 'starts_at': '2017-04-15 12:00:00 GMT', 'ends_at': '2017-04-16 12:00:00 GMT', owner_user_id: 1 }
      ];
      validate(req, res, { success: true, response: { events }}, 200, eventRoutes.list);
    });
  });

  describe('creation', () => {
    it('should fail without an event title', () => {
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "title", "msg": "Title is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail without a start date', () => {
      req.body = {
        title: 'Test Event',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "starts_at", "msg": "Start date is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail without an end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "ends_at", "msg": "End date is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail with invalid start date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: null,
        ends_at: '2017-04-17 12:00:00 GMT'
      };
      validate(req, res, {"success":false,"errors":[{"type":"event.create.starts_at.invalid","message":"Invalid start date."}]}, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail with invalid end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-17 12:00:00 GMT',
        ends_at: null
      };
      validate(req, res, {"success":false,"errors":[{"type":"event.create.ends_at.invalid","message":"Invalid end date."}]}, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should create an event', () => {
      let event = {
        id: 1,
        title: 'Test Event',
        starts_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      req.body = event;
      validate(req, res, { success: true, message: 'Event created successfully.', response: { event: { id: 1, 'title': 'Test Event', 'starts_at': '2017-04-15 12:00:00 GMT', 'ends_at': '2017-04-16 12:00:00 GMT', owner_user_id: 1 }}}, 201, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "msg": "An event id is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let eventRoutesFailure = new Event({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"event.detail.not_found","message":"No event found for provided id."}]}, 404, eventRoutesFailure.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should display the details of an event', () => {
      req.params = { id: 1 };
      req.user = { user_id: 1 };
      validate(req, res, { success: true, response: { event: { id: 1, owner_user_id: 1, title: 'Test Event', starts_at: '2017-04-15 12:00:00 GMT', ends_at: '2017-04-16 12:00:00 GMT' }}}, 200, eventRoutes.detail);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { id: 'asdf' };
      let validationErrors = [{ "param": "id", "msg": "An event id is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(4);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should fail without an event title', () => {
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "title", "msg": "Title is required." }];
      req.validationErrors = function() { return validationErrors };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(4);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should fail with invalid start date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: null,
        ends_at: '2017-04-17 12:00:00 GMT'
      };
      validate(req, res, {"success":false,"errors":[{"type":"event.update.starts_at.invalid","message":"Invalid start date."}]}, 400, eventRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(4);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should fail with invalid end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-17 12:00:00 GMT',
        ends_at: null
      };
      validate(req, res, {"success":false,"errors":[{"type":"event.update.ends_at.invalid","message":"Invalid end date."}]}, 400, eventRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(4);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should update an event', () => {
      let event = {
        title: 'Test Event',
        starts_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      req.body = event;
      req.params = { id: 1 };
      validate(req, res, { success: true, message: 'Event updated successfully.' }, 201, eventRoutes.update);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(4);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid event id', () => {
      req.params = { event_id: 1 };
      let eventRoutesFailure = new Event({ 'db': dbFailures, 'log': log });
      validate(req, res, {"success":false,"errors":[{"type":"event.delete.not_found","message":"No event found for provided id."}]}, 404, eventRoutesFailure.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should delete an event', () => {
      req.params = { event_id: 1 };
      validate(req, res, { success: true, response: { message: 'Event deleted.' }}, 200, eventRoutes.delete);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    })
  })
});