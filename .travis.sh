#!/bin/sh

# Exit on error of any of the commands
set -e

# Clerk frontend
cd clerk-frontend
npm install > /dev/null
npm test
npm audit || [ $(date +%s) -lt 1593561613 ] # Temporarily disable until 1 july due to yargs-parser low severity issue in toolchain

# Waardepapieren service
cd ../waardepapieren-service/
npm install
# Ignore self-signed cert
npm test
npm run system-test
npm audit


# Integration
cd ..
export CERT_HOST_IP=$(ip -o addr show | grep -E "eth0.*inet " | grep -E -o  -e "[0-9]*(\.[0-9]*){3}" | head -1)
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
