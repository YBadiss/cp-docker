'use strict';

const _ = require('lodash');

const mongo = require('./mongo');

/**
 * @export
 * Retrieve a single rider, given its id.
 * @param {Integer} id Id of the rider to retrieve.
 */
async function get(id) {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  const rider = await collection.findOne({'_id': id});
  return rider ? JSON.parse(JSON.stringify(rider)) : null;
}

/**
 * @export
 * List all available riders. Only return their id and name.
 */
async function list() {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  const riders = await collection.find({}, {_id: 1, name: 1}).toArray();
  return riders ? JSON.parse(JSON.stringify(riders)) : null;
}

/**
 * @export
 * Delete a rider, or all riders if no id is provided. A bit radical, I know.
 * @param {Integer} id Id of the rider to delete.
 */
async function remove(id) {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  const filter = id ? {'_id': id} : {};
  let err, r;
  [err, r] = await mongo.to(collection.deleteMany(filter));
  return err;
}

/**
 * @export
 * Create a new rider given its name and id. The rider starts with a bronze status and no
 * points.
 * @param {Integer} id Rider id
 * @param {String} name Rider name
 */
async function create(id, name) {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  let err, r;
  const rider = {
    '_id': id,
    name: name,
    rides: {},
    loyalty: {
      status: 'bronze',
      points: 0
    }
  };
  [err, r] = await mongo.to(collection.insertOne(rider));
  return err;
}

/**
 * Update a rider object. No protection here, this is a private function.
 */
async function update(rider) {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  let err, r;
  [err, r] = await mongo.to(collection.update({'_id': rider._id}, rider));
  return err;
}

/**
 * @export
 * Create new ride in progress.
 * @param {Object} rider Owner of the ride
 * @param {Integer} rideId
 * @param {Float} price Initial price of the ride
 */
async function createRide(rider, rideId, price) {
  let ride = rider.rides[rideId];
  if (ride) {
    return 'Ride already exists';
  }
  if (!price) {
    return 'Invalid price';
  }

  rider.rides[rideId] = {
    status: 'InProgress',
    price,
    // Store the date so we can recompute loyalty with different rules later on
    startedAt: new Date().toISOString()
  };
  return await update(rider);
}

/**
 * Compute loyalty status of a rider, given the number of rides they have completed:
 * - bronze:     0 <= NB rides < 20
 * - silver:    20 <= NB rides < 50
 * - gold:      50 <= NB rides < 100
 * - platinum: 100 <= NB rides
 */
function computeLoyaltyStatus(completedRides) {
  const numRides = completedRides.length;
  if (numRides < 20) {
    return 'bronze';
  } else if (numRides < 50) {
    return 'silver';
  } else if (numRides < 100) {
    return 'gold';
  }
  return 'platinum';
}

/**
 * Compute the points earned for a single completed ride. The price-to-points multiplier
 * depends on the loyalty status:
 * - bronze:   1€ = 1  point
 * - silver:   1€ = 3  points
 * - gold:     1€ = 5  points
 * - platinum: 1€ = 10 points
 */
function pointsFromRide(completedRide, loyaltyStatus) {
  let multiplier;
  if (loyaltyStatus === 'bronze') {
    multiplier = 1;
  } else if (loyaltyStatus === 'silver') {
    multiplier = 3;
  } else if (loyaltyStatus === 'gold') {
    multiplier = 5;
  } else {
    multiplier = 10;
  }
  return completedRide.price * multiplier;
}

/**
 * @export
 * Change status of a ride to completed, update its price, and update the loyalty status
 * and points of the rider.
 * @param {Object} rider Owner of the ride
 * @param {Integer} rideId
 * @param {Float} price Final price of the ride
 */
async function completeRide(rider, rideId, price) {
  let ride = rider.rides[rideId];
  if (!ride) {
    return 'Ride not found';
  }
  if (ride.status === 'Complete') {
    return 'Ride already completed';
  }
  rider.rides[rideId] = {
    ...ride,
    status: 'Complete',
    price,
    // Store the date so we can recompute loyalty with different rules later on
    completedAt: new Date().toISOString()
  };
  rider.loyalty.status = computeLoyaltyStatus(_.filter(rider.rides, { status: 'Complete' }));
  rider.loyalty.points += pointsFromRide(ride, rider.loyalty.status);
  return await update(rider);
}

module.exports = {
  get,
  create,
  list,
  remove,
  createRide,
  completeRide
};
