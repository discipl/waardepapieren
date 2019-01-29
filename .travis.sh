#!/bin/sh
cd clerk-frontend
npm install
npm test
cd ././waardepapieren-service/
npm install
npm test
