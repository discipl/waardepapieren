#!/bin/sh

# Clerk frontend
cd clerk-frontend
npm install
npm test
npm audit

# Waardepapieren service
cd ../waardepapieren-service/
npm install
npm test
npm run system-test
npm audit


# Integration
cd ..
docker-compose -f docker-compose-travis.yml build
docker-compose -f docker-compose-travis.yml up -d

echo "Waiting for dockers to start"
while [ -n "$(docker ps -a | grep starting)" ];
do
    echo $(docker ps -a | grep starting)
    sleep 5
done
echo "Dockers are booted"

cd clerk-frontend
cypress run
