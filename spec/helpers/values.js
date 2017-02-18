global.userDescribe = {
  "name": {
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
  "confirmation_token": {
    "type": "VARCHAR(255)",
    "allowNull": true,
    "defaultValue": null,
    "primaryKey": false
  },
  "password": {
    "type": "password",
    "allowNull": false,
    "primaryKey": false
  }
};