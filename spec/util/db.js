let user = {
  then: function(callback) {
    callback({
      id: 1,
      save: function() {
        return {
          then: function(callback) {
            callback({ id: 1 });
          }
        }
      },
      setRole: function() {
        return true;
      }
    });
  },
  spread: function(callback) {
    callback({
      id: 1,
      save: function() {
        return {
          then: function(callback) {
            callback({
              id: 1
            });
            return {
              catch: function(callback) { callback({ error: 'error message' })}
            }
          }
        }
      },
      setRole: function() {
        return true;
      }
    }, true);
  }
};
let eventData = {
  id: 1,
  title: 'Test Event',
  starts_at: '2017-04-15 12:00:00 GMT',
  ends_at: '2017-04-16 12:00:00 GMT',
  owner_user_id: 1
}
let event = {
  then: function(callback) {
    callback(Object.assign({
      update: function() { return { then: function(callback) { callback(eventData); }}},
      destroy: function() {}
    }, eventData));
  }
};
let events = {
  then: function(callback) {
    callback([eventData])
  }
}
let rescueData = {
  id: 1,
  name: 'Test Rescue',
  street_address: '123 Test St',
  city: 'Testsville',
  state: 'TN',
  zip_code: '12345'
}
let rescue = {
  then: function(callback) {
    callback(Object.assign({
      update: function() { return { then: function(callback) { callback(rescueData)}}},
      destroy: function() {}
    }, rescueData));
  }
};
let rescues = {
  then: function(callback) {
    callback([rescueData])
  }
}
let schedule = {
  then: function(callback) {
    callback({
      id: 1,
      title: 'Test Schedule',
      event_id: 1,
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              title: 'Test Schedule',
              event_id: 1
            });
          }
        }
      },
      destroy: function() { return true; }
    });
  }
};
let schedules = {
  then: function(callback) {
    callback([{
      id: 1,
      title: 'Test Schedule',
      event_id: 1
    }]);
  }
};
let scheduleItem = {
  then: function(callback) {
    callback({
      id: 1,
      title: 'Test Schedule Item',
      assigned_user_id: 1,
      schedule_id: 1,
      starts_at: '2017-04-15T12:00:00.000Z',
      ends_at: '2017-04-16T12:00:00.000Z',
      order: 1,
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              title: 'Test Schedule Item',
              assigned_user_id: 1,
              schedule_id: 1,
              starts_at: '2017-04-15T12:00:00.000Z',
              ends_at: '2017-04-16T12:00:00.000Z',
              order: 1
            });
          }
        }
      },
      destroy: function() { return true; }
    });
  }
}
let scheduleItems = {
  then: function(callback) {
    callback([{
      id: 1,
      title: 'Test Schedule Item',
      assigned_user_id: 1,
      schedule_id: 1,
      starts_at: '2017-04-15T12:00:00.000Z',
      ends_at: '2017-04-16T12:00:00.000Z',
      order: 1
    }]);
  }
}
let userTable = {
  "id": {
    "type": "INTEGER",
    "allowNull": true,
    "primaryKey": true
  },
  "name": {
    "type": "VARCHAR(255)",
    "allowNull": true,
    "primaryKey": false
  },
  "facebook_id": {
    "type": "VARCHAR(255)",
    "allowNull": true,
    "primaryKey": false
  },
  "created_at": {
    "type": "DATETIME",
    "allowNull": false,
    "primaryKey": false
  },
  "updated_at": {
    "type": "DATETIME",
    "allowNull": false,
    "primaryKey": false
  },
  "email": {
    "type": "VARCHAR(255)",
    "allowNull": true,
    "primaryKey": false
  },
  "password_hash": {
    "type": "TEXT",
    "allowNull": true,
    "primaryKey": false
  },
  "salt": {
    "type": "VARCHAR(255)",
    "allowNull": true,
    "primaryKey": false
  },
  "confirmed": {
    "type": "DATETIME",
    "allowNull": true,
    "defaultValue": null,
    "primaryKey": false
  },
  "confirmation_token": {
    "type": "VARCHAR(255)",
    "allowNull": true,
    "defaultValue": null,
    "primaryKey": false
  }
}
let userDescribe = {
  then: function(callback) { callback(userTable) }
}
let role = {
  then: function(callback) {
    callback({
      id: 1,
      title: 'user'
    });
  }
}
let transferData = {
  id: 1,
  pet_id: 1,
  event_id: 1
};
let transfer = {
  then: function(callback) {
    callback(Object.assign({destroy: function() { return true; }}, transferData));
    return { then: function(callback) {
      callback();
    }}
  }
};
let pet = {
  then: function(callback) {
    callback({
      id: 1,
      name: 'Test Pet',
      pet_type_id: 1,
      comments: 'Good dog.',
      pet_type: {
        id: 1,
        title: 'Dog'
      },
      Transfers: [transferData],
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              name: 'Test Pet',
              pet_type_id: 1,
              pet_type: {
                id: 1,
                title: 'Dog'
              },
              Transfers: [transferData],
              comments: 'Good dog.'
            });
          }
        }
      },
      destroy: function() { return true; }
    });
  }
}
let pets = {
  then: function(callback) {
    callback([{
      id: 1,
      name: 'Test Pet',
      pet_type_id: 1,
      comments: 'Good dog.',
      pet_type: {
        id: 1,
        title: 'Dog'
      },
      Transfers: [transferData],
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              name: 'Test Pet',
              pet_type_id: 1,
              comments: 'Good dog.',
              Transfers: [transferData],
              pet_type: {
                id: 1,
                title: 'Dog'
              }
            });
          }
        }
      },
      destroy: function() { return true; }
    }]);
  }
}
let petTypes = {
  then: function(callback) {
    callback([{
      id: 1,
      title: 'Dog'
    }]);
  }
};

module.exports = {
  User: {
    findOne: function() { return user; },
    create: function() { return user; },
    findOrCreate: function() { return user; },
    describe: function() { return userDescribe; },
    findByPk: function() { return user; }
  },
  Role: {
    findOne: function() { return role; }
  },
  Event: {
    create: function() { return event; },
    findByPk: function() { return event; },
    update: function() { return event; },
    findAll: function() { return events; }
  },
  Rescue: {
    create: function() { return rescue; },
    findByPk: function() { return rescue; },
    update: function() { return rescue; },
    findAll: function() { return rescues; }
  },
  Schedule: {
    create: function() { return schedule; },
    findByPk: function() { return schedule; },
    update: function() { return schedule; },
    findAll: function() { return schedules; }
  },
  ScheduleItem: {
    create: function() { return scheduleItem; },
    findByPk: function() { return scheduleItem; },
    update: function() { return scheduleItem; },
    findAll: function() { return scheduleItems; }
  },
  Pet: {
    create: function() { return pet; },
    findByPk: function() { return pet; },
    update: function() { return pet; },
    findAll: function() { return pets; }
  },
  PetType: {
    findAll: function() { return petTypes; }
  },
  Transfer: {
    create: function() { return transfer; },
    findOne: function() { return transfer; }
  }
}