# Technical Test / Full-stack

**Please read those instructions carefully**, it contains useful information to help you complete the
test successfully.

## Purpose

This test will ask you to develop a micro-service and a optionally front-end application using it. 
Some goals are required and some are optional. The micro-service is responsible for managing the 
loyalty program, and is using an event-driven approach by listening to AMQP messages and reacting 
accordingly.

To facilitate the evaluation, we advice you to use :
- Node >= 8.5
- Express >= 4.14
- React >= 16.2 (if need be)

And optionally (if needed) :
- MongoDB >= 2.6
- RabbitMQ >= 3.4.1
- PostgreSQL >= 9.4
- nvm >= 0.33

## Additional note

### Message producer

A 'producer' is provided (have a look at the `producer` folder), it simulates a production environment
by generating user events you're supposed to react to (user signup, ride completed, etc.). If you
decide to use it (and we think you should), you will need an AMQP server (like RabbitMQ) running
locally, or you can use the provided Dockerfile. You can get further details in the producer
`README.md` file.

### Skeletons

This test provide two basic skeletons to help you get started, one for the back-end part (written in
node.js), and one for the front-end part (using React). You can choose to use them or start from
scratch, it's up to you. In any case, those are just basic examples you will need to improve.

You can also use different languages and/or frameworks, as soon as they belong to our
stack (Node.js >= 8.5, Golang >= 1.8, Python >= 3.4).

## Required Goals

### Implement loyalty points earning

Each rider has a status. The status is computed from the number of rides completed
according to the following rule:
```text
  - bronze:     0 <= NB rides < 20
  - silver:    20 <= NB rides < 50
  - gold:      50 <= NB rides < 100
  - platinum: 100 <= NB rides
```

When a rider finishes a ride, he gains an amount of loyalty points. The amount of
points is computed with a multiplier according to the following rule:
```text
  - bronze:   1€ = 1  point
  - silver:   1€ = 3  points
  - gold:     1€ = 5  points
  - platinum: 1€ = 10 points
```
For example:
- If a bronze rider paid 15€, he earns 15 loyalty points.
- If a gold rider paid 8€, he earns 40 loyalty points.


## Optional Goals

**You are not required to do those goals to complete the test**!
But each completed additional goal will be a bonus for your review.

### Implement a front-end for the rider

Rider must be able to check on a page:
- Its current loyalty status
- Its current loyalty points
- Its current number of rides / remaining to next status
- The screen should be updated regularly

### Add ride history to the front-end

Rider can now see on its page:
- history of its rides with total paid / loyalty points earned

### Monitoring screen with top 10 riders

An admin or employee can access another page displaying a chart with the top 10 riders in the system
(number of rides) that update in real-time.

### Monitoring screen with top 10 riders by loyalty status

An admin or employee can access another page displaying a chart with the top 10 riders in the system
by loyalty status.

### Monitoring screen with advanced filters and sorts

The top 10 charts can now show the ranking based on number of rides but also loyalty points. The
number of users in the chart can be adjusted.

### Statistics section in monitoring screen

An admin or employee can see another section in the monitoring screen giving various informations
about the loyalty program (number of riders per status, number of loyalty points, rides, etc.)

### Your idea

Propose and implement (a) new idea(s) for the monitoring screen, the rider loyalty screen or something
else to improve the application / the micro-service.


## Expected completion time

A few hours for a basic solution (and a little more if you want to fulfill the goals) using the
provided skeleton.

## Launching the backend server
``` bash
> cd back
> npm install
> npm start
```

Open [http://localhost:8000/api/hello/robert/32](http://localhost:8000/api/hello/robert/32) to
check the provided API example route.

## Launching the frontend server
``` bash
> cd front
> npm install
> npm start
```

Open [http://localhost:3000](http://localhost:3000) to check the example page.


## Launching the message producer
``` bash
> cd producer
> npm install
> N=50 TIC=500 npm start
```

Whenever you're ready to "live test" your code, start the producer and messages should 
begin to enqueue in your AMQP server. Have a look at the script documentation for further details.
