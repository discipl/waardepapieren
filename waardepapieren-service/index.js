
const svc = require('discipl-abundance-service')
const accessLayer = require('discipl-4sacan')

const ISSUER = 'Haarlem'
const PUBLIC_PLATFORM = 'iota'
const PRIVATE_PLATFORM = 'node' // by default, the local discipl node platform is used underlying all verifiable credential wallet platforms 
const PRODUCT_TYPE = 'Bewijs Inschrijving GBA - '+ISSUER
const PRODUCT_SOURCE_PLATFORM = 'nlx'
const SOURCE_SUBJECT = 'nlxHaarlemOrgName'
const SOURCE_PREDICATE = PRODUCT_TYPE

// initialisation at install (only once)
ssidPub = svc.attendTo(PUBLIC_PLATFORM, PRODUCT_TYPE)
svc.serviceInfo(ssidPub, {service-referral:'Loket Publiekszaken of http://haarlem.nl/'})
let ssidHaarlemRevokePub = core.newSsid(PUBLIC_PLATFORM)
svc.serviceInfo(ssidPub, {revocationChannel:ssidHaarlemRevokePub})

// initialisation service startup (or new attestor DID required)
ssidAttestor = newSsid(PRIVATE_PLATFORM)
accessLayer.require(ssidAttestor, 'allowedBSN', {didWebsiteAuth, didEmployee})
accessLayer.allow(ssidAttestor, 'all')
svc.referTo(ssidPub, ssidAttestor.did)

// local issuer service event handler
subscribe(ssidAttestor).then(function (res) {
  let ssid = attendTo(PRIVATE_PLATFORM, PRODUCT_TYPE)
  accessLayer.allow(ssid, res)
  let nlxClaimLink = core.claim(SOURCE_SUBJECT, SOURCE_PREDICATE, getBSN(res, ssidAttestor))
  let attestLink = core.attest(ssidAttestor, PRODUCT_TYPE, nlxClaimLink)
  accessLayer.allow(ssidAttestor, res)
  core.claim(ssid, 'product', {attestation:attestLink})
  svc.match(ssid, res)
  // note it is the attestLinkt that is the handle to revoke the attestation
}
