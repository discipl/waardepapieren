#!/bin/bash

if [ ! -z "$BASE64_EPHEMERAL_KEY" ]; then
  echo "$BASE64_EPHEMERAL_KEY" | base64 -d > /ephemeral-certs/org.key;
fi

if [ ! -z "$BASE64_EPHEMERAL_CERT" ]; then
  echo "$BASE64_EPHEMERAL_CERT" | base64 -d > /ephemeral-certs/org.crt;
fi

if [ ! -z "$BASE64_NLX_KEY" ]; then
  echo "$BASE64_NLX_KEY" | base64 -d > /certs/org.key;
fi

if [ ! -z "$BASE64_NLX_CERT" ]; then
  echo "$BASE64_NLX_CERT" | base64 -d > /certs/org.crt;
fi

if [ ! -z "$BASE64_WAARDEPAPIEREN_CONFIG" ]; then
  echo "$BASE64_WAARDEPAPIEREN_CONFIG" | base64 -d > /app/configuration/waardepapieren-config.json;
fi