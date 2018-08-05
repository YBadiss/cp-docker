const _ = require('lodash');
const amqplib = require('amqplib');
const logger = require('chpr-logger');
const request = require('request');

const AMQP_URL = process.env.AMQP_URL;
const EXCHANGE = process.env.AMQP_EXCHANGE;
const QUEUE = process.env.AMQP_BASE_QUEUE;
const API_URL = process.env.API_URL;
const TARGET_ACTIONS = {
  rider: {
    signup: _.partial(handler_wrapper, handle_signup)
  },
  ride: {
    create: _.partial(handler_wrapper, handle_create),
    completed: _.partial(handler_wrapper, handle_completed)
  }
};

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * AMQP client for messages subscription
 */
let client;

/**
 * Initialize the amqp queues. Each message type has a queue bound to part of the exchange
 */
async function init() {
  // Rabbitmq takes a while before being ready, so we try to connect until it works
  while (true) {
    try {
      logger.info('> RabbitMQ initialization');
      client = await amqplib.connect(AMQP_URL);
      break;
    } catch(error) {
      logger.error('Failed to init, trying again soon...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
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
 * Wrapper for message handler, logging content, successes, and errors
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
 * Process a signup event
 */
function handle_signup(payload, httpCallback) {
  request.post(
    `${API_URL}/rider/${payload.id}`,
    { json: { name: payload.name } },
    httpCallback
  );
}

/**
 * Process a ride creation event
 */
function handle_create(payload, httpCallback) {
  const json = { action: 'create', price: payload.amount };
  const url = `${API_URL}/rider/${payload.rider_id}/rides/${payload.id}`;
  request.post(url, { json }, httpCallback);
}

/**
 * Process a ride completion event
 */
function handle_completed(payload, httpCallback) {
  const json = { action: 'complete', price: payload.amount };
  const url = `${API_URL}/rider/${payload.rider_id}/rides/${payload.id}`;
  request.post(url, { json }, httpCallback);
}

/**
 * Main function of the script
 */
async function main() {
  logger.info('> Consumer initialization...');
  await init();
  while (true) {
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
