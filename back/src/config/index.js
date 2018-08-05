'use strict';

module.exports = {
  port: process.env.PORT || 8000,
  mongodb: {
    name: 'loyalty',
    url: process.env.MONGO_URL || 'mongodb://ybadiss:pwd123@localhost:27017/temp',
    options: {
      ssl: process.env.MONGO_SSL === 'true',
      sslValidate: process.env.MONGO_SSL_VALIDATE === 'true',
      sslCA: [new Buffer(process.env.MONGO_SSL_CERT || '', 'utf-8')],
      native_parser: true,
      authSource: 'admin'
    }
  }
};
