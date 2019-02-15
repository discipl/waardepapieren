#!/bin/sh

# Clerk frontend
cd clerk-frontend
npm install
npm test

# Waardepapieren service
cd ../waardepapieren-service/
npm install
npm test


# Integration
cd ..
docker-compose build
docker-compose up -d

echo "Waiting for dockers to start"
while [ -n "$(docker ps -a | grep starting)" ];
do
    echo $(docker ps -a | grep starting)
    sleep 5
done
echo "Dockers are booted"

cd clerk-frontend
cypress run