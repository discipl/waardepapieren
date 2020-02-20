#!/bin/bash

if [ ! -z "$BASE64_KEY" ]; then
  echo "$BASE64_KEY" | base64 -d > /etc/nginx/certs/org.key;
fi

if [ ! -z "$BASE64_CERT" ]; then
  echo "$BASE64_CERT" | base64 -d > /etc/nginx/certs/org.crt;
fi
