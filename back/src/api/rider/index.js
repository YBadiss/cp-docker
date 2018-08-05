'use strict';

const express = require('express');
const wrap = require('co-express');

const controller = require('./rider.controller');

const router = express.Router();

/**
 * @api {get} /hello/:name/:id get welcome message
 * @apiGroup Hello
 *
 * @apiDescription get welcome message
 *
 * @apiParam {String} name the name of a user
 * @apiParam {String} id some identifier
 *
 * @apiSuccess {String} welcome message
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    message: 'Welcome Robert (id: 32)!'
 *  }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL_SERVER_ERROR
 *     {
 *       message: 'Invalid request'
 *     }
 *
 */
router.get('/', wrap(controller.listRiders));
router.get('/:id', wrap(controller.getRider));
router.post('/:id', wrap(controller.createRider));
router.get('/:id/rides', wrap(controller.listRides));
router.get('/:id/rides/:rideId', wrap(controller.getRide));
router.post('/:id/rides/:rideId', wrap(controller.upsertRide));

module.exports = router;
