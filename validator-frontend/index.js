const core = require('discipl-core')
const VERIFIABLE_CREDENTIAL_PLATFORM = 'paper' // or irma, or uport or ...
const PRODUCT_TYPE

vcpl = core.getConnector(VERIFIABLE_CREDENTIAL_PLATFORM)

let paperwallet = vcpl.scan(qrsvg)
let link = paperwallet.verify(PRODUCT_TYPE)
if(isTrustedAttestorDid(vcpl.getSsidOfLinkedClaim(link)) && notRevoked(link)) {
  show(core.get(link))
  // we only verified the truthness according to the right municipality of a certain BSN being registered as living in the municipality
  // the validator probably should check the holder to be a legitimate person to register the person the BSN refers to
  echo('please authenticate holder of this credential to have the BSN that has been shown though other means')
} else {
  echo('invalid')
}
