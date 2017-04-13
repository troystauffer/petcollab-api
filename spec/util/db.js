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
  }
}