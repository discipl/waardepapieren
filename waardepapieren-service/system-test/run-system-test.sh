#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

docker build -t mock-nlx $DIR/../../mock-nlx/

CONTAINER_ID=$(docker run --detach --publish 4080:4080 mock-nlx)

cd $DIR/..
NODE_TLS_REJECT_UNAUTHORIZED=0 ./node_modules/.bin/mocha --require @babel/register ./test/**/*.spec.js


docker stop $CONTAINER_ID