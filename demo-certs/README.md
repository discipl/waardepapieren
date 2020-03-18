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

Generating custom "valid" self signed certificates
==================================================

A fake CA called myCA is added.
This CA is meant to be used a CA that can be imported in the browser for development.
When creating certificates this CA can sign them and when the CA is trusted by the browser, certificates signed by this CA are trusted automatically.

This CA is valid until 2025.
The CA password is password :)

## Creating a signed certificate

You need to know what the domain name will become.
for example for localhost:

- Ensure you are in this demo-certs directory in your terminal.
- Copy paste the following statement:

```
NAME=localhost
# Generate private key
[[ -e $NAME.key ]] || openssl genrsa -out $NAME.key 2048
# Create certificate-signing request
[[ -e $NAME.csr ]] || openssl req -new -key $NAME.key -out $NAME.csr
# Create a config file for the extensions
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $NAME
DNS.2 = www.$NAME
EOF
# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out $NAME.crt -days 1825 -sha256 -extfile $NAME.ext
```

The first line is important, this will be the domain name you're generating a certificate for.

Also note the "alt_names"
The certificate created here will be valid for the domainname given as well as the www. variant.

You will be asked questions for the certificate information.
What you insert is up to you but the common name fqdn has be the same as the domain name the certificate has to be valid for.

Example:

- Country: NL
- State: Utrecht
- City: Amersfoort
- Organization: Discipl
- Organisational unit: ICT
- Common name: localhost <------ !!! The domain name again
- Email address: fake@no.reply
- Password: {skip}
- Optional company name: {skip}
- The password for the CA: password

You'll receive 4 files of which 2 are necessary.
- localhost.crt
- localhost.key

These two can now be used in whatever webserver you are using.
They are signed by the fake CA.

The browser knows and trusts the CA so it also accepts this certificate.
