const core = require('discipl-core')
const accessLayer = require('discipl-4sacan')

const VERIFIABLE_CREDENTIAL_PLATFORM = 'paper' // or irma or uport or ...
core = require('discipl-core')
ssid = need(VERIFIABLE_CREDENTIAL_PLATFORM, PRODUCT_TYPE)
bsnLink = core.claim(ssid, 'BSN', clientBSN)
accessLayer.allow(ssid, (didHaarlemPub))
core.attest(ssidEmployee, ‘allowedBSN’, bsnlink)
subscribe('ssid').then(function (res) => {
  // in case of paper platform
  let qrsvg = core.getConnector(VERIFIABLE_CREDENTIAL_PLATFORM).issue(getAttestLink(ssid))
  print(qrsvg)
})
