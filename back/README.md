# Loyalty API

## Installation

### Mongo

```bash
> docker pull mongo
> docker run --name store --restart=always -d -p 27017:27017 mongo mongod --auth
> sudo docker exec -i -t store bash # bash into the container
>> mongo # connect to local mongo
>>> use admin # create admin user
>>> db.createUser({user:"ybadiss",pwd:"pwd123",roles:[{role:"root",db:"admin"}]})
>>> exit
>> exit
```

### Server

```bash
docker build --tag 'server:latest' .
docker create --name server -p 8000:8000 --link store server:latest
docker start server
```
