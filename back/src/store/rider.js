'use strict';

const _ = require('lodash');

const mongo = require('./mongo');

/**
 * @export
 */
async function get(id) {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  const rider = await collection.findOne({'_id': id});
  return rider ? JSON.parse(JSON.stringify(rider)) : null;
}

/**
 * @export
 */
async function list() {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  const riders = await collection.find({}, {_id: 1, name: 1});
  // TODO this is somehow circular
  return riders ? JSON.parse(JSON.stringify(riders)) : null;
}

/**
 * @export
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
 * @export
 */
async function update(rider) {
  const client = await mongo.client();
  const collection = await client.collection('riders');
  let err, r;
  [err, r] = await mongo.to(collection.update({'_id': rider._id}, rider));
  return err;
}

/**
 * Get welcome message
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
    price
  };
  return await update(rider);
}

// - bronze:     0 <= NB rides < 20
// - silver:    20 <= NB rides < 50
// - gold:      50 <= NB rides < 100
// - platinum: 100 <= NB rides
/**
 * Get welcome message
 */
function computeLoyaltyStatus(completedRides) {
  const numRides = completedRides.length;
  if (numRides < 20) {
    return 'bronze';
  } else if (numRides < 50) {
    return 'silver';
  } else if (numRides < 100) {
    return 'gold';
  } else {
    return 'platinum';
  }
}

// - bronze:   1€ = 1  point
// - silver:   1€ = 3  points
// - gold:     1€ = 5  points
// - platinum: 1€ = 10 points
/**
 * Get welcome message
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
 * Get welcome message
 */
async function completeRide(rider, rideId, price) {
  let ride = rider.rides[rideId];
  if (!ride) {
    return 'Ride not found';
  }
  if (ride.status === 'Complete') {
    return 'Ride already completed';
  }
  ride.status = 'Complete';
  ride.price = price;
  rider.rides[rideId] = ride;
  rider.loyalty.status = computeLoyaltyStatus(_.filter(rider.rides, { status: 'Complete' }));
  rider.loyalty.points += pointsFromRide(ride, rider.loyalty.status);
  return await update(rider);
}

module.exports = {
  get,
  create,
  list,
  createRide,
  completeRide
};
