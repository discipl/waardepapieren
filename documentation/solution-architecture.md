
# Discipl Waardepapieren, Solution Architecture

## Introduction

The Discipl Waardepapieren solution aims at a W3C Verifiable Credentials compatible solution for
credentials of citizens or even more generally: any signed information issued by an entity, for instance a municipality. Citizens are not required to have any equipment which implies a credential can be issued to a “paper wallet” being a QR code printed on paper. The solution is based on the Discipl architecture and software stack, open source and free to use. The solution is platform agnostic.

This project is a follow up on the one in 2018 (github.com/haarlem/digitale-waardepapieren). The main difference is that even no derivations of personal information like peppered hashes are stored in public ledgers like IOTA. This information is signed and given to the citizen and the signed information is enough to validate the information as been signed by the municipality given a official public key is used which is published in public. For this the NLX platform with its key distribution is used following a newly proposed API strategy. Also this project does not aim at a proof of concept or prototype but a real working solution that can be put into production.

The initial focus is to use a (legacy) data source through NLX as source of the information to be issued and a custom made 'paper wallet' solution as verifiable credential platform. The architecture prepares for usage of other platforms instead of this in the future like IRMA and minimally prepares for integration into automated needs matching services envisioned within Discipl.

This document describes a high level solution architecture with software components as most detailed level and following ISO-42010 and NORA five layer model in a most pragmatic lean way intended to be readable for all stakeholders involved.

Note: expect this document to change as it is work in progress.

## Foundational layer

The solution needs to be compliant with the following laws, architectures and regulations:

- NORA / GEMMA, and all implications from this though noteworthy:
- EIF/EiDAS
- GDPR
- EN 301 549 / WCAG 2.0 (accessibility)
- ETSI TS 103 171 (XAdES) for paper wallet signatures
- BIR2017 (security management)
- REGULATION (EU) No 910/2014 (as far as applicable)
...

Note that the core solution itself does not include identification / authentication services for citizens
nor any key distribution mechanism which is more dependent on the specific platforms being used.

## Organisational layer

<<picture>>

The following stakeholders and use cases are identified:

- issuer
- client
- validator
- administrator

## Information layer

All information is temporarily held in verifiable claim channels on the so called ephemeral platform (in memory). This platform will enforce access rights denoted by the channel owner through discipl-4sacan, so all channels are only accessible to the channel owner holding a corresponding private key created and temporarily held by the channel owner.
Of course the party hosting the ephemeral server and it's administrator needs to be trusted also, but as this is the issuer as source of the information it is by definition a party already chosen or forced to be trusted by the client. The following channels will be created using this solution holding the following information (verifiable claims) with what kind of accessibility retention:

<<picture>>

1) service channel of issuer, destroyed at service shutdown
  - that a service with some id is attending to needs for what : (ssid, attendTo, what)
  - (possibly a log of needs that has been attended to)
2) need channel of client, destroyed after solving the need or at max for X minutes or service shutdown whatever comes first
  - that a client with some id is in need for what : (ssid, need, what)
  - that the client refers to a certain BSN number for this. (ssid, BSN, bsn-number)
  - that the client allows access to this channel to issuer
  - that the client attests the information prepared by the issuer in the delivery channel to be true
  - that the client successfully got the signed information in the format it wants by denoting the need as solved
3) NLX result channel of issuer, held in memory until read or at max for X minutes or service shutdown whatever comes first
  - the result of a NLX call stored in relation to some unique ssid (only used once)
4) delivery channel of issuer, destroyed after solving the need or at max for X minutes or service shutdown whatever comes first
  - that a service with some id is attending to a single specific need that has been noticed for what : (ssid, attendTo, what)
  - all the information the issuer has prepared to issue, taken from the NLX result channel
  - that the specific client in need is allowed to access this channel
  - that it matches a specific need for that same what
  - that it attests (with signature using NLX outway key) the information to be issued
5) validation channel of validator, destroyed after validation or service shutdown whatever comes first
  - the same claim and attestation pair as was issued from the delivery channel of the issuer, read from the QR code on a piece of paper

besides these channels, information is issued and stored in verifiable credential platforms. For now only a custom paper wallet platform is used which stores an attested claim in a QR code printed on a piece of paper to be owned by the client. This piece of paper shall also contain the raw information contained in the attested claim in the QR code which limits the amount of data that can be held in claims such you can issue them in a paper wallet.

The solution just presents, signs and issues information as returned as result from the NLX call; for now it does not semantically parses this information. For now, the webapi called through NLX needs to accept a BSN number as argument. The object of what is needed or attended to is something configured by the issuer like 'Uittreksel-GBA-Haarlem'. All other data results from usage of the abundance service api, 4sacan api and
discipl core api and the connectors used (ephemeral and NLX for now).

## Application layer

The solution is mainly hosted on a central Discipl ephemeral server application hosted by the issuer to which
multiple client applications (for clients, issuer and administrator) connect to (through the client side Discipl core api).

The issuer runs a waardepapieren service on this server that sets up the ephemeral server and connects to this to attend to needs expressed by other clients on this platform. The following other client applications connect to this ephemeral service hosted by the issuer:

clerk-frontend
authorisation-service
client-frontend
adminstrator-frontend

<<picture>>

Validation does not require usage of this server; validators run their own embedded local ephemeral service (without client-server communication) just to hold information temporarily and use it for their own validation process executed within the client side validation web application.

## Infrastructural layer

<<picture>>

The solution is hosted on a server in control of the issuer and used by the devices (broad range of desktop computers, mobile phones or tablets)
in control of citizens, clerks, validators and administrators. The server at the issuer is accessible on the intranet of the issuer and publicly through an existing web server (in a controlled way) that also will serve the different kinds of client side web applications.

## Key decisions

- scope : the waardepapieren service will provide in a single product that can be issued.
- scope : the information being signed is that of the result data of a NLX call given the BSN number as argument
- scope : only the paper wallet is in scope as supported verifiable credential solution
- scope : identification/authentication is performed either by the clerk-frontend user in the local intranet the waardepapieren service runs, or through the authentication service integrated within the website through which the service is made accessible

## Future directions

The solution is prepared to be used in different kind of situations and set ups and use cases in which other types of platforms can be used instead of ephemeral, NLX or paper wallet. The idea is that it is prepared for usage in automated facilitation in requirement resolving in which for instance when a client needs something that requires a signed proof of some issuer, the proof can be automatically and conveniently requested as need
and once issued by the issuer to the client provided by the client to the validator, identifying themselves through future self sovereign identity solutions from within all kinds of solutions developed independently from the service provided by the issuer.
