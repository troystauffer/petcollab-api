'use strict';
const _ = require('lodash');

module.exports = function(){
  let defaults = {
    jws: {
      key: process.env.SESSION_KEY,
      algorithm: 'HS256'
    },
    encryption: {
      algorithm: 'aes-256-ctr',
      secret: process.env.SESSION_KEY
    },
    easyPbkdf2: {
      DEFAULT_HASH_ITERATIONS: 10,
      SALT_SIZE: 32,
      KEY_LENGTH: 256
    },
    apiPrefix: '/v1',
    confirmationTokenLength: 6
  };

  switch(process.env.NODE_ENV){
  case 'development':
  default:
    return _.assign(defaults, {
      port: process.env.PORT || 3300,
      database: {
        dialect: 'mysql',
        database: 'papi_dev',
        username: process.env.PAPI_DATABASE_USERNAME,
        password: process.env.PAPI_DATABASE_PASSWORD,
        port: process.env.PAPI_DATABASE_PORT || 3306,
        host: '127.0.0.1'
      },
      log: {
        name: 'petcollab-api-dev',
        level: 'info',
        stream: process.stdout
      },
      morgan: {
        format: 'dev',
        options: {
          skip: function (req) { return req.url == '/favicon.ico'; }
        }
      }
    });

  case 'test':
    return _.assign(defaults, {
      port: process.env.PORT || 3000,
      database: {
        dialect: 'mysql',
        database: 'papi_test',
        username: process.env.PAPI_DATABASE_USERNAME,
        password: process.env.PAPI_DATABASE_PASSWORD,
        port: process.env.PAPI_DATABASE_PORT || 3306,
        host: '127.0.0.1'
      },
      log: {
        name: 'petcollab-api-test',
        level: 'error',
        stream: process.stdout
      },
      morgan: {
        format: 'dev',
        options: {
          skip: function () { return true; }
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