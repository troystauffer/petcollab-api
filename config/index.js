'use strict';
const _ = require('lodash');

module.exports = function(){
  let defaults = {
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3300/v1/auth/facebook/return'
    },
    sessionKey: process.env.SESSION_KEY,
    easyPbkdf2: {
      DEFAULT_HASH_ITERATIONS: 10,
      SALT_SIZE: 32,
      KEY_LENGTH: 256
    }
  };

  switch(process.env.NODE_ENV){
    case 'development':
    default:
      return _.assign(defaults, {
        port: process.env.PORT || 3300,
        database: {
          dialect: 'sqlite',
          storage: './petcollab-db.development.sqlite',
          logging: false
        },
        log: {
          name: 'petcollab-api-dev',
          streams: [
            {
              level: 'info',
              stream: process.stdout
            },
            {
              level: 'error',
              stream: process.stdout
            }
          ]
        },
        morgan: {
          format: 'dev',
          options: {
            skip: function (req, res) { return req.url == '/favicon.ico' }
          }
        }
      });

    case 'test':
      return _.assign(defaults, {
        port: process.env.PORT || 3000,
        database: {
          dialect: 'sqlite',
          storage: './petcollab-db.test.sqlite',
          logging: false
        }, 
        log: {
          name: 'petcollab-api-test',
          level: 'error',
          stream: process.stdout
        },
        morgan: {
          format: 'dev',
          options: {
            skip: function (req, res) { return true }
          }
        }
      });

    case 'production':
      return _.assign(defaults, {
        port: process.env.PORT,
        database: {
          use_env_variable: 'POSTGRES_CONNECTION_STRING',
          dialect: 'postgres',
          protocol: 'postgres',
          native: true,
          ssl: true,
          dialectOptions: {
            'ssl': true
          },
          logging: false
        }, 
        log: {
          name: 'petcollab-api',
          streams: [
            {
              level: 'info',
              stream: process.stdout
            },
            {
              level: 'error',
              stream: process.stderr
            }
          ]
        },
        facebook: {
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL: 'https://petcollab-api.herokuapp.com/v1/auth/facebook/return'
        },
        easyPbkdf2: {
          DEFAULT_HASH_ITERATIONS: 10000,
          SALT_SIZE: 32,
          KEY_LENGTH: 256
        },
        morgan: {
          format: 'combined',
          options: {}
        }
      });
  }
};