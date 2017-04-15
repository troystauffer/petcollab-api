import path from 'path';
import Event from '../../routes/event/event';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';
import Sequelize from '../../models/';
import Config from '../../config/';

const config = new Config();
const sequelize = new Sequelize(config.database);

describe('Event', () => {
  let res = {};
  let req = {};
  let eventRoutes = {};
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    eventRoutes = new Event({ 'db': db, 'log': log });
  })

  describe('event listing', () => {
    let events = [
      { 'title': 'Test Event 1', 'starts_at': '2017-04-15 12:00:00 GMT', 'ends_at': '2017-04-16 01:00:00 GMT' },
      { 'title': 'Test Event 2', 'starts_at': '2017-04-17 15:00:00 GMT', 'ends_at': '2017-04-17 16:00:00 GMT' }
    ];
    it('should return a list of events', () => {
      sequelize.Event.bulkCreate(events).then((events) => {
        validate(req, res, { success: true, response: { events }}, 200, eventRoutes.events);
      });
    });
  });

  describe('event creation', () => {
    it('should fail without an event title', () => {
      let error = [{ "param": "email", "msg": "Title is required." }];
      req.body = {
        start_at: '2017-04-15 12:00:00 GMT',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail without a start date', () => {
      let error = [{ "param": "starts_at", "msg": "Start date is required." }];
      req.body = {
        title: 'Test Event',
        ends_at: '2017-04-16 12:00:00 GMT'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail without an end date', () => {
      let error = [{ "param": "ends_at", "msg": "End date is required." }];
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-16 12:00:00 GMT'
      };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail with invalid start date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: null,
        ends_at: '2017-04-17 12:00:00 GMT'
      };
      validate(req, res, { success: false, message: 'Invalid start date.' }, 400, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
    it('should fail with invalid end date', () => {
      req.body = {
        title: 'Test Event',
        starts_at: '2017-04-17 12:00:00 GMT',
        ends_at: null
      };
      validate(req, res, { success: false, message: 'Invalid end date.' }, 400, eventRoutes.create);
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
      validate(req, res, { success: true, message: 'Event created successfully.', response: {event} }, 201, eventRoutes.create);
      expect(req.calls.checkBody).toEqual(3);
      expect(req.calls.notEmpty).toEqual(3);
    });
  });

  describe('event details', () => {
    it('should fail without an id', () => {
      let error = [{ "param": "email", "msg": "An event id is required." }];
      req.params = { id: 1 };
      req.validationErrors = function() { return [error] };
      validate(req, res, { success: false, message: 'The data provided to the API was invalid or incomplete.', errors: [error] }, 400, eventRoutes.event);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should return a 404 when provided an id not in the database', () => {
      req.params = { id: 1 };
      let eventRoutesFailure = new Event({ 'db': dbFailures, 'log': log });
      validate(req, res, { success: false, message: 'No event found for provided id.' }, 404, eventRoutesFailure.event);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
    it('should display the details of an event', () => {
      req.params = { id: 1 };
      validate(req, res, { success: true, response: { event: { id: 1, title: 'Test Event', starts_at: '2017-04-15 12:00:00 GMT', ends_at: '2017-04-16 12:00:00 GMT' }}}, 200, eventRoutes.event);
      expect(req.calls.checkParams).toEqual(1);
      expect(req.calls.notEmpty).toEqual(1);
      expect(req.calls.isNumeric).toEqual(1);
    });
  });

  describe('event editing', () => {
    xit('should prevent unauthorized access', () => {
    });
    xit('should fail without an id', () => {
    });
    xit('should fail with an invalid id', () => {
    });
    xit('should fail without an event title', () => {
    });
    xit('should fail with invalid start date', () => {
    });
    xit('should fail with invalid end date', () => {
    });
    xit('should update an event', () => {
    });
  });
});