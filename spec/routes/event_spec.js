import Event from '../../routes/event/event';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Event', () => {
  let res, req, eventRoutes, expressValidate = {};

  beforeEach(() => {
    res = new Res();
    req = new Req();
    expressValidate = () => { return { isEmpty: function() { return true }, array: function() { return [] }}};
    eventRoutes = new Event({ db, log, validate: expressValidate });
  })

  describe('listing', () => {
    it('should return a list of events', () => {
      let events = [
        { id: 1, 'title': 'Test Event', 'starts_at': '2017-04-15 12:00:00 GMT', 'ends_at': '2017-04-16 12:00:00 GMT', owner_user_id: 1 }
      ];
      validateRequest(req, res, { success: true, response: { events }}, 200, eventRoutes.list);
    });
  });

  describe('creation', () => {
    it('should fail without an event title', () => {
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "title", "message": "Title is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let eventRoutesFailure = new Event({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutesFailure.create);
    });
    it('should fail without a start date', () => {
      req.body = {
        title: 'Test Event',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "starts_at", "message": "Start date is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let eventRoutesFailure = new Event({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutesFailure.create);
    });
    it('should fail without an end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "ends_at", "message": "End date is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let eventRoutesFailure = new Event({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutesFailure.create);
    });
    it('should fail with invalid start date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: null,
        ends_at: '2017-04-17 12:00:00 GMT'
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"event.create.starts_at.invalid","message":"Invalid start date."}]}, 400, eventRoutes.create);
    });
    it('should fail with invalid end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-17 12:00:00 GMT',
        ends_at: null
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"event.create.ends_at.invalid","message":"Invalid end date."}]}, 400, eventRoutes.create);
    });
    it('should create an event', () => {
      let event = {
        id: 1,
        title: 'Test Event',
        starts_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      req.body = event;
      validateRequest(req, res, { success: true, message: 'Event created successfully.', response: { event: { id: 1, 'title': 'Test Event', 'starts_at': '2017-04-15 12:00:00 GMT', 'ends_at': '2017-04-16 12:00:00 GMT', owner_user_id: 1 }}}, 201, eventRoutes.create);
    });
  });

  describe('details', () => {
    it('should fail without an id', () => {
      let validationErrors = [{ "param": "id", "message": "An event id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let eventRoutesFailure = new Event({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutesFailure.detail);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let eventRoutesFailure = new Event({ 'db': dbFailures, 'log': log, 'validate': expressValidate });
      validateRequest(req, res, {"success":false,"errors":[{"type":"event.detail.not_found","message":"No event found for provided id."}]}, 404, eventRoutesFailure.detail);
    });
    it('should display the details of an event', () => {
      req.params = { id: 1 };
      req.user = { user_id: 1 };
      validateRequest(req, res, { success: true, response: { event: { id: 1, owner_user_id: 1, title: 'Test Event', starts_at: '2017-04-15 12:00:00 GMT', ends_at: '2017-04-16 12:00:00 GMT' }}}, 200, eventRoutes.detail);
    });
  });

  describe('editing', () => {
    it('should fail with an invalid id', () => {
      req.params = { id: 'asdf' };
      let validationErrors = [{ "param": "id", "message": "An event id is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let eventRoutesFailure = new Event({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutesFailure.update);
    });
    it('should fail without an event title', () => {
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      let validationErrors = [{ "param": "title", "message": "Title is required." }];
      let expressValidate = () => { return { isEmpty: function() { return false }, array: function() { return validationErrors }}};
      let eventRoutesFailure = new Event({ db, log, validate: expressValidate});
      validateRequest(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: validationErrors }, 400, eventRoutesFailure.update);
    });
    it('should fail with invalid start date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: null,
        ends_at: '2017-04-17 12:00:00 GMT'
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"event.update.starts_at.invalid","message":"Invalid start date."}]}, 400, eventRoutes.update);
    });
    it('should fail with invalid end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-17 12:00:00 GMT',
        ends_at: null
      };
      validateRequest(req, res, {"success":false,"errors":[{"type":"event.update.ends_at.invalid","message":"Invalid end date."}]}, 400, eventRoutes.update);
    });
    it('should update an event', () => {
      let event = {
        title: 'Test Event',
        starts_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      req.body = event;
      req.params = { id: 1 };
      validateRequest(req, res, { success: true, message: 'Event updated successfully.' }, 201, eventRoutes.update);
    });
  });

  describe('deleting', () => {
    it('should return a 404 when given an invalid event id', () => {
      req.params = { event_id: 1 };
      let eventRoutesFailure = new Event({ 'db': dbFailures, log, validate: expressValidate });
      validateRequest(req, res, {"success":false,"errors":[{"type":"event.delete.not_found","message":"No event found for provided id."}]}, 404, eventRoutesFailure.delete);
    });
    it('should delete an event', () => {
      req.params = { event_id: 1 };
      validateRequest(req, res, { success: true, response: { message: 'Event deleted.' }}, 200, eventRoutes.delete);
    })
  })
});