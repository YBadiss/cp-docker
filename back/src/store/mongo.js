'use strict';

const mongodb = require('mongodb');

const config = require('../config');

let mongoClient = null;

/**
 * @export
 */
async function client() {
  if (!mongoClient) {
    mongoClient = await mongodb.MongoClient.connect(config.mongodb.url, config.mongodb.options);
  }
  return mongoClient;
}

/**
 * @param {Promise} promise
 * @return {Promise}
 */
function to(promise) {
  return promise.then(data => {
     return [null, data];
  })
  .catch(err => [err]);
}

module.exports = {
  client,
  to
};
