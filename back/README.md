# Loyalty API

## Installation

### Mongo

```bash
> docker pull mongo
> docker run --name store --restart=always -d -p 27017:27017 mongo mongod --auth
> sudo docker exec -i -t store mongo admin --eval "db.createUser({user:'ybadiss',pwd:'pwd123',roles:[{role:'root',db:'admin'}]})"
```

### Server

```bash
docker build --tag 'server:latest' .
docker create --name server -p 8000:8000 --link store server:latest
docker start server
```
