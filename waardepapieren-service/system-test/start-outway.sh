#!/bin/bash

docker run --detach \
  --name my-nlx-outway \
  --volume $PWD/system-test/certs:/certs/ \
  --env DIRECTORY_ADDRESS=directory-api.demo.nlx.io:443 \
  --env TLS_NLX_ROOT_CERT=/certs/root.crt \
  --env TLS_ORG_CERT=/certs/org.crt \
  --env TLS_ORG_KEY=/certs/org.key \
  --env DISABLE_LOGDB=1 \
  --publish 4080:80 \
  nlxio/outway:v0.0.20
