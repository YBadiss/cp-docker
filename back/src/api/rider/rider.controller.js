'use strict';

const HttpStatus = require('http-status-codes');

const store = require('../../store');

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function getRider(req, res) {
  const { id } = req.params;
  let rider = await store.rider.get(id);
  if (rider) {
    return res.status(HttpStatus.OK).send(rider);
  } else {
    return res.status(HttpStatus.NOT_FOUND).send({ message: `Rider ${id} not found.`});
  }
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function listRiders(req, res) {
  let riders = await store.rider.list();
  if (riders) {
    return res.status(HttpStatus.OK).send(riders);
  } else {
    return res.status(HttpStatus.NOT_FOUND).send({ message: 'No riders found.'});
  }
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function deleteRider(req, res) {
  const { id } = req.params;
  let err = await store.rider.remove(id);
  if (!err) {
    return res.status(HttpStatus.OK).send({ message: `Rider ${id} deleted.`});
  } else {
    return res.status(HttpStatus.BAD_REQUEST).send({ message: `Failed to delete rider ${id}.`});
  }
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function deleteRiders(req, res) {
  let err = await store.rider.remove();
  if (!err) {
    return res.status(HttpStatus.OK).send({ message: 'All riders deleted.'});
  } else {
    return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Failed to delete riders.'});
  }
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function createRider(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  let err = await store.rider.create(id, name);
  if (!err) {
    return res.status(HttpStatus.OK).send({ message: `Created rider ${id}.`});
  } else {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: `Failed to create rider ${id}`,
      error: err
    });
  }
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function getRide(req, res) {
  const { id, rideId } = req.params;

  let rider = await store.rider.get(id);
  if (!rider) {
    return res.status(HttpStatus.NOT_FOUND).send({ message: `Rider ${id} not found.` });
  }

  let ride = rider.rides[rideId];
  if (ride) {
    return res.status(HttpStatus.OK).send(ride);
  } else {
    return res.status(HttpStatus.NOT_FOUND).send({
      message: `Ride ${rideId} does not exist.`
    });
  }
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function listRides(req, res) {
  const { id } = req.params;

  let rider = await store.rider.get(id);
  if (!rider) {
    return res.status(HttpStatus.NOT_FOUND).send({ message: `Rider ${id} not found.` });
  }

  return res.status(HttpStatus.OK).send(rider.rides);
}

/**
 * Get welcome message
 * @param {Object} req express request
 * @param {Object} res express response
 */
async function upsertRide(req, res) {
  const { id, rideId } = req.params;
  const { action, price } = req.body;

  let rider = await store.rider.get(id);
  if (!rider) {
    return res.status(HttpStatus.NOT_FOUND).send({ message: `Rider ${id} not found.` });
  }

  let err;
  if (action === 'create') {
    err = await store.rider.createRide(rider, rideId, price);
  } else if (action === 'complete') {
    err = await store.rider.completeRide(rider, rideId, price);
  } else {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: `Unknown action ${action} for ride.`
    });
  }

  if (!err) {
    return res.status(HttpStatus.OK).send({ message: `Upserted ride ${rideId}`});
  } else {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: `Failed to update ride ${rideId}`,
      error: err
    });
  }
}

module.exports = {
  getRider,
  listRiders,
  createRider,
  deleteRider,
  deleteRiders,
  getRide,
  listRides,
  upsertRide
};
