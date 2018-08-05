const _ = require('lodash');
const amqplib = require('amqplib');
const logger = require('chpr-logger');
const request = require('request');

/**
 */

const AMQP_URL = process.env.AMQP_URL || 'amqp://guest:guest@localhost:5672';
const EXCHANGE = process.env.AMQP_EXCHANGE;
const API_URL = process.env.API_URL;
const QUEUE = 'loyalty';
const TARGET_ACTIONS = {
    rider: {
        signup: _.partial(handler_wrapper, handle_signup)
    },
    ride: {
        create: _.partial(handler_wrapper, handle_create),
        completed: _.partial(handler_wrapper, handle_completed)
    }
};

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

/**
 * AMQP client for messages publication
 */
let client;

/**
 * 
 */
async function init() {
    logger.info('> RabbitMQ initialization');
    client = await amqplib.connect(AMQP_URL);
    client.channel = await client.createChannel();

    await client.channel.assertExchange(EXCHANGE, 'topic', {
        durable: true
    });
    for (var target in TARGET_ACTIONS) {
        const actions = TARGET_ACTIONS[target];
        for (var action in actions) {
            const queue = `${QUEUE}.${target}.${action}`;
            const handler = actions[action];
            await client.channel.assertQueue(queue);
            await client.channel.bindQueue(queue, EXCHANGE, `${target}.${action}`);
            await client.channel.consume(queue, handler);
        }
    }
}

/**
 *
 * @param {Object} obj
 */
function handler_wrapper(handler, obj) {
    let requestId = obj.content.toString().hashCode();
    let message = JSON.parse(obj.content.toString());
    logger.info(`${requestId} Received ${message.type} message `, message.payload);

    handler(message.payload, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            logger.info(`${requestId} Success!`, body);
        } else {
            logger.info(`${requestId} Failed...`, body);
        }
    });
}

/**
 *
 * @param {Object} obj
 */
function handle_signup(payload, httpCallback) {
    request.post(
        `${API_URL}/rider/${payload.id}`,
        { json: { name: payload.name } },
        httpCallback
    );
}

/**
 *
 * @param {Object} obj
 */
function handle_create(payload, httpCallback) {
    const json = { action: 'create', price: payload.amount };
    const url = `${API_URL}/rider/${payload.rider_id}/rides/${payload.id}`;
    logger.info(`Sending to ${url}: `, json);
    request.post(url, { json }, httpCallback);
}

/**
 *
 * @param {Object} obj
 */
function handle_completed(payload, httpCallback) {
    const json = { action: 'complete', price: payload.amount };
    const url = `${API_URL}/rider/${payload.rider_id}/rides/${payload.id}`;
    logger.info(`Sending to ${url}: `, json);
    request.post(url, { json }, httpCallback);
}

/**
 * Main function of the script
 * @param {number} n Number of riders to start
 * @param {number} [growth=1000] Time interval (ms) before increasing the messages rate
 */
async function main() {
    logger.info('> Consumer initialization...');
    await init();
    while(true) {
        await Promise.all([
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);
    }
}

main()
    .then(() => {
        logger.info('> Worker stopped');
        process.exit(0);
    }).catch(err => {
        logger.error({
            err
        }, '! Worker stopped unexpectedly');
        process.exit(1);
    });
