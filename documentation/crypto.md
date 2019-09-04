# Cryptographical architecture

## Short version

The data that is attested is signed using a certificate. 
The validator app validates:
1. The validity of the signature
2. The validity of the certificate

## Less short version

The data that the QR-code on a waardepapier contains is as follows:

- The actual data signed
- The signature over this data (embedded in the link to the claim)
- The fingerprint of the certificate used to sign (embedded in the did of the attestor)
- A link to where the full certificate-chain can be obtained. 

The certificate-chain includes the certificate used to sign, plus all intermediate certificates, excluding the CA root.

Once the validator app scans a code, it will:

1. Fetch the certificate
2. Validate that the certificate used to sign is (indirectly) trusted by the CA root, by validating the full chain
3. Validate the signature using the certificate and the data signed

The CA root is pinned in the validator app. In development mode, the CA root is a [self-signed cert](demo-certs/rootDemoCA.pem).
Since the key is present in this repo, anyone can sign valid certificates for attestions.
In production mode (strict validation), the CA root is the [Staat der Nederlanden EV](https://www.pkioverheid.nl/) certificate.
