# Waardepapieren

This project provides a full implementation example of how Discipl components can be used to issue and
verify claims. In particular, how municipalities can issue 


## Running 

Running the applications is easiest done using docker-compose. 

This will start 3 applications:

- clerk-frontend
- waardepapieren-service, with embedded ephemeral-server
- nlx-mock, which is an nlx-outway that provides access to a mock BRP service

Note that the nlx-mock and waardepapieren-service need a valid certificate for the demo NLX environment.

1. Generate certificates as described [here](https://docs.nlx.io/get-started/create-certificates/)
2. Run `docker-compose up`

Alternatively, you can use an offline mock, which replicates the NLX environment.

1. Run `docker-compose -f docker-compose-travis.yml up`




