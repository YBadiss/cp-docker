I only completed the required goal, building an api in express connected to mongodb, which
is fed data coming from a rabbitmq queue.

I noticed that you had the needed settings for consuming rabbitmq data inside of the express
server, but I'd rather have it as a separate process sending http requests to the back.

So in the end we have:
- mongodb running in the `store` container
- express running in the `server` container
- rabbitmq running in the `rabbitmq` container
- and two containers to produce and consume events

## How to run

You can disregard the other readmes, I only keep them as a reference. Simply run `docker-compose up`. You should quickly see the producer and consumer logging messages sent/received.

You can have a look at the riders created by sending a get on `http://localhost:8000/api/rider/`.
From there you can look at individual riders and rides. See `back/src/api/rider/index.js`
for more details on the api.

