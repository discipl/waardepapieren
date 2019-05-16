# Waardepapieren

This project provides a full implementation example of how Discipl components can be used to issue and
verify claims. In particular, how municipalities can issue

## Running

The easiest way to run is using docker-compose:

This will start 3 applications:

- clerk-frontend
- waardepapieren-service, with embedded ephemeral-server
- nlx-mock, which is an nlx-outway that provides access to a mock BRP service

Note that the nlx-mock and waardepapieren-service need a valid certificate for the demo NLX environment.

1. Generate certificates as described [here](https://docs.nlx.io/get-started/create-certificates/), and place the `org.key` and `org.crt` files at `./waardepapieren-service/system-test/certs/`
2. Run `docker-compose up`

Alternatively, you can use an offline mock, which replicates the NLX environment.

1. Run `docker-compose -f docker-compose-travis.yml up`

# Running validator
The validator app is made with [Expo](https://expo.io/), which is a free and open-source react-native framework for mobile development. to run this on a mobile device, the expo-cli tool is required. to install this, run:
```bash
$npm install -g expo-cli
```
connect to the same network without firewall restrictions (if all else fails, starting an hotspot on your mobile device and connecting to it usually works). In the folder "validator-frontend", issue the command:
```bash
$expo start
```
wait till the program has fully loaded and scan the QR code in the left bottom corner, with the Expo-app for [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) or [IOS](https://itunes.apple.com/us/app/expo-client/).
