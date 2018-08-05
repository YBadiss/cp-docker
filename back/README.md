# Loyalty API

## Installation
``` bash
> npm install
```

## Launch tests
``` bash
> npm test
```

## Start server
``` bash
> npm start
```

Open [http://localhost:8000/api/hello/robert/32](http://localhost:8000/api/hello/robert/32) to 
check the provided API example route.


# Mongo

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

```bash
docker build --tag 'server:latest' .
docker create --name server -p 8000:8000 server:latest
docker start server

docker stop server && docker rm server && docker build --tag 'server:latest' . && docker create --name server -p 8000:8000 --link store server:latest && docker start server
```
