FROM node:8.5

ENV AMQP_URL amqp://guest:guest@rabbitmq:5672
ENV AMQP_EXCHANGE events
ENV N 20
ENV TIC 5000

ADD . /code
WORKDIR /code
RUN npm install --production
CMD ["npm", "start"]