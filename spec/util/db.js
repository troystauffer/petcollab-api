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
      ends_at: '2017-04-16 12:00:00 GMT'
    });
  }
};
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

module.exports = {
  User: {
    findOne: function() {
      return user;
    },
    create: function() {
      return user;
    },
    findOrCreate: function() {
      return user;
    },
    describe: function() {
      return userDescribe;
    }
  },
  Role: {
    findOne: function() {
      return role;
    }
  },
  Event: {
    create: function() {
      return event;
    },
    findById: function() {
      return event;
    }
  }
}