export BASE64_EPHEMERAL_KEY=$(cat ./waardepapieren-service/system-test/ephemeral-certs/org.key | base64 -w 0)
export BASE64_EPHEMERAL_CERT=$(cat ./waardepapieren-service/system-test/ephemeral-certs/org.crt | base64 -w 0)
export BASE64_NLX_KEY=$(cat ./waardepapieren-service/system-test/certs/org.key | base64 -w 0)
export BASE64_NLX_CERT=$(cat ./waardepapieren-service/system-test/certs/org.crt | base64 -w 0)
export BASE64_WAARDEPAPIEREN_CONFIG=$(cat ./waardepapieren-service/configuration/waardepapieren-config-compose-travis.json | base64 -w 0)

export BASE64_KEY=$(cat ./clerk-frontend/nginx/certs/org.key | base64 -w 0)
export BASE64_CERT=$(cat ./clerk-frontend/nginx/certs/org.crt | base64 -w 0)
