import path from 'path';
import Event from '../../routes/event/event';
import Res from '../util/res';
import Req from '../util/req';
import db from '../util/db';
import dbFailures from '../util/db_failures';
import log from '../util/log';

describe('Event', () => {
  let res = {};
  let req = {};
  let userRoutes = {};
  
  beforeEach(() => {
    res = new Res();
    req = new Req();
    eventRoutes = new Event({ 'db': db, 'log': log });
  })

  describe('event listing', () => {
    xit('should prevent unauthorized access', () => {
    });
    xit('should return a list of events', () => {
    });
  });

  describe('event creation', () => {
    xit('should prevent unauthorized access', () => {
    });
    xit('should fail without an event title', () => {
    });
    xit('should fail with invalid start date', () => {
    });
    xit('should fail with invalid end date', () => {
    });
    xit('should create an event', () => {
    });
  });

  describe('event details', () => {
    xit('should prevent unauthorized access', () => {
    });
    xit('should fail without an id', () => {
    });
    xit('should fail with an invalid id', () => {
    });
    xit('should display the details of an event', () => {
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