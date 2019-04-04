# waardepapieren

project for consortium of municipalities digitizing PoE services

the project aims at a W3C verifiable credential compatible (or alike) solution based on discipl core for proving all kinds of facts atested for by an issuer (with a focus on municipalities as issuer).

# Running

Running the applications is easiest done using docker-compose. Simply run `docker-compose up`.
This will start 3 applications:

- clerk-frontend
- waardepapieren-service, with embedded ephemeral-server
- nlx-mock, which mocks an NLX API, such that development can be done independently

components:

- client-frontend : frontend webapplication (js) embedded in the my-environment provided by the municipality, which connects to a discipl node to retrieve a needed proof.
- clerk-frontend : frontend webapplication (js) which connects to a discipl node to retrieve a needed proof of a selected person (by referring to a BSN).
- authorization-backend : simple serverside authorization script that enables access to the abundance service that delivers certain proofs to a given ssid (authenticated for the my-environment, or being a clerk)
- validator-frontend : frontend webapplication (js) that can validate a proof
- dashboard
- revoke-service
- waardepapieren-service

these components might involve the following components from the discipl software stack:

- discipl-abundance-service
- discipl-4sacan
- discipl-expo
- discipl-rshiny
- discipl-core
- discipl-core-restapi
- discipl-core-node
- discipl-core-paper
- discipl-core-nlx
- discipl-core-iota
- discipl-core-ipfs
- discipl-core-irma

architectural primer : https://docs.google.com/presentation/d/1sw7xi2UbmxRN3NBwQTn9kWw6-RNhygdRL5kccnZWUyE

# Running validator
The validator app is made with [Expo](https://expo.io/), which is a free and open-source react-native framework for mobile development. to run this on a mobile device, connect to the same network without firewall restrictions (if all else fails, starting an hotspot on your mobile device and connecting to it usually works). In the folder "validator-frontend", issue the command:
```bash
$expo start
```
wait till the program has fully loaded and scan the QR code in the left bottom corner, with the Expo-app for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) or [IOS](https://itunes.apple.com/us/app/expo-client/).
