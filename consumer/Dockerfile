FROM node:8.5

ENV AMQP_URL amqp://guest:guest@rabbitmq:5672
ENV AMQP_EXCHANGE events
ENV AMQP_BASE_QUEUE loyalty
ENV API_URL http://server:8000/api

ADD . /code
WORKDIR /code
RUN npm install --production
CMD ["npm", "start"]