FROM node:8.5

ENV MONGO_URL mongodb://ybadiss:pwd123@store:27017/temp
ENV PORT 8000
EXPOSE 8000

ADD . /code
WORKDIR /code
RUN npm install --production
CMD ["npm", "start"]