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
let event = {
  then: function(callback) {
    callback({
      id: 1,
      title: 'Test Event',
      starts_at: '2017-04-15 12:00:00 GMT',
      ends_at: '2017-04-16 12:00:00 GMT',
      owner_user_id: 1,
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              title: 'Test Event',
              starts_at: '2017-04-15 12:00:00 GMT',
              ends_at: '2017-04-16 12:00:00 GMT',
              owner_user_id: 1
            });
          }
        }
      },
      destroy: function() {}
    });
  }
};
let events = {
  then: function(callback) {
    callback([{
      id:1,
      title: 'Test Event',
      starts_at: '2017-04-15 12:00:00 GMT',
      ends_at: '2017-04-16 12:00:00 GMT',
      owner_user_id: 1
    }])
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
let pet = {
  then: function(callback) {
    callback({
      id: 1,
      name: 'Test Pet',
      pet_type_id: 1,
      comments: 'Good dog.',
      PetType: {
        id: 1,
        title: 'Dog'
      },
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              name: 'Test Pet',
              pet_type_id: 1,
              PetType: {
                id: 1,
                title: 'Dog'
              },
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
      PetType: {
        id: 1,
        title: 'Dog'
      },
      update: function() {
        return {
          then: function(callback) {
            callback({
              id: 1,
              name: 'Test Pet',
              pet_type_id: 1,
              comments: 'Good dog.',
              PetType: {
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
    describe: function() { return userDescribe; }
  },
  Role: {
    findOne: function() { return role; }
  },
  Event: {
    create: function() { return event; },
    findById: function() { return event; },
    update: function() { return event; },
    findAll: function() { return events; }
  },
  Schedule: {
    create: function() { return schedule; },
    findById: function() { return schedule; },
    update: function() { return schedule; },
    findAll: function() { return schedules; }
  },
  ScheduleItem: {
    create: function() { return scheduleItem; },
    findById: function() { return scheduleItem; },
    update: function() { return scheduleItem; },
    findAll: function() { return scheduleItems; }
  },
  Pet: {
    create: function() { return pet; },
    findById: function() { return pet; },
    update: function() { return pet; },
    findAll: function() { return pets; }
  },
  PetType: {
    findAll: function() { return petTypes; }
  }
}