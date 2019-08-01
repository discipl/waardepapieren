Where did these files come from?
================================

The file `EVRootCa.pem` is the actual Extended Validation root cert for the Staat der Nederlanden. It was retrieved from `pkioverheid.nl` 
and converted to pem format with the command: `openssl x509 -inform der -in EVRootCA.cer -out EVRootCa.pem`

This file is included in the `ScanScreen` class in the validator app in a string literal.

The rootDemoCA files and haarlem-demo files represent a CA and a certificate that's issued. They were generated 
using the commands in [this gist](https://gist.github.com/fntlnz/cf14feb5a46b2eda428e000157447309).

The haarlem-demo cert and key were copied to: `./waardepapieren/system-test/certs/` to allow it to be used for signing.
The haarlem-demo cert was copied to `./clerk-frontend/public/certs/` such that it can be served to the validator app.

The rootDemoCA file is also included in the `ScanScreen` class to be used in development.