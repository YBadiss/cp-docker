'use strict';

const express = require('express');
const wrap = require('co-express');

const controller = require('./rider.controller');

const router = express.Router();

/**
 * @api {get} /rider List all riders
 * @apiGroup Rider
 *
 * @apiDescription List all riders
 *
 * @apiSuccess {Array} List of all riders id and name
 */
router.get('/', wrap(controller.listRiders));

/**
 * @api {delete} /rider Delete all riders
 * @apiGroup Rider
 *
 * @apiDescription Delete all riders
 */
router.delete('/', wrap(controller.deleteRiders));

/**
 * @api {post} /rider/:id Get a rider
 * @apiGroup Rider
 *
 * @apiDescription Get a rider
 *
 * @apiParam {String} id The id of the rider
 *
 * @apiSuccess {Object} The rider object
 */
router.get('/:id', wrap(controller.getRider));

/**
 * @api {delete} /rider/:id Delete a rider
 * @apiGroup Rider
 *
 * @apiDescription Create new rider
 *
 * @apiParam {String} id The id of the rider
 */
router.delete('/:id', wrap(controller.deleteRider));

/**
 * @api {post} /rider/:id Create new rider
 * @apiGroup Rider
 *
 * @apiDescription Create new rider
 *
 * @apiParam {String} id The id of the rider
 * @apiBody {String} name The name of the rider
 *
 * @apiSuccess {String} Success message
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "message": "Created rider 2."
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 INTERNAL_SERVER_ERROR
 *     {
 *       "message": "Failed to create rider 2",
 *       "error": {
 *         "name": "MongoError",
 *         "message": "E11000 duplicate key error collection: temp.riders index: _id_ dup key: { : \"2\" }",
 *         "driver": true,
 *         "index": 0,
 *         "code": 11000,
 *         "errmsg": "E11000 duplicate key error collection: temp.riders index: _id_ dup key: { : \"2\" }"
 *       }
 *     }
 */
router.post('/:id', wrap(controller.createRider));

/**
 * @api {get} /rider/:id/rides List all rides of a rider
 * @apiGroup Rider
 *
 * @apiDescription List all rides of a rider
 *
 * @apiParam {String} id The id of the rider
 * @apiParam {String} rideId The id of the ride
 *
 * @apiSuccess {Array} List of rides
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "1": {
 *      "status": "InProgress",
 *      "price": 10,
 *      "timestamp": "2018-08-05T17:35:26.274Z"
 *    }
 *  }
 */
router.get('/:id/rides', wrap(controller.listRides));

/**
 * @api {get} /rider/:id/rides/:rideId Get a ride
 * @apiGroup Rider
 *
 * @apiDescription Get an existing ride
 *
 * @apiParam {String} id The id of the rider
 * @apiParam {String} rideId The id of the ride
 *
 * @apiSuccess {Object} The requested ride object
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "status": "InProgress",
 *    "price": 10,
 *    "startedAt": "2018-08-05T17:35:26.274Z"
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 INTERNAL_SERVER_ERROR
 *     {
 *       "message": "Ride 2 does not exist."
 *     }
 */
router.get('/:id/rides/:rideId', wrap(controller.getRide));

/**
 * @api {post} /rider/:id/rides/:rideId Create or update a ride
 * @apiGroup Rider
 *
 * @apiDescription Create or update a ride
 *
 * @apiParam {String} id The id of the rider
 * @apiParam {String} rideId The id of the ride
 *
 * @apiSuccess {String} Success message
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "message": "Upserted ride 1"
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 INTERNAL_SERVER_ERROR
 *     {
 *       "message": "Failed to update ride 1",
 *       "error": "Ride already exists"
 *     }
 */
router.post('/:id/rides/:rideId', wrap(controller.upsertRide));

module.exports = router;
