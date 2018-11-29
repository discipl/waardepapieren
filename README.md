# waardepapieren

project for consortium of municipalities digitizing PoE services

the project aims at a W3C verifiable credential compatible (or alike) solution based on discipl core for proving all kinds of facts atested for by an issuer (with a focus on municipalities as issuer).

components:

- client-frontend : frontend webapplication (js) embedded in the my-environment provided by the municipality, which connects to a discipl node to retrieve a needed proof.
- clerk-frontend : frontend webapplication (js) which connects to a discipl node to retrieve a needed proof of a selected person (by referring to a BSN).
- authorization-backend : simple serverside authorization script that enables access to the abundance service that delivers certain proofs to a given ssid (authenticated for the my-environment, or being a clerk)
- validator-frontend : frontend webapplication (js) that can validate a proof
- dashboard
- revoke-service
- waardepapieren-service

these components use the following components from the discipl software stack:

- discipl-abundance-service
- discipl-4sacan
- discipl-expo
- discipl-rshiny
- discipl-core-paper
- discipl-core-iota
- discipl-core-ipfs
- discipl-core-nlx
- discipl-core-irma
- discipl-core
