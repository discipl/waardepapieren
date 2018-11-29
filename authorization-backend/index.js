const core = require('discipl-core')

ssidWebsiteClientAuth = core.newSsid('node')

const onAuthRequest = (req, res) => {
  let bsnlink = req.parameters['bsnlink']
  if(session[‘bsn’] == core.get(bsnlink, ssidWebsiteClientAuth.did).data.BSN)
    core.attest(ssidWebsiteClientAuth, ‘allowedBSN’, bsnlink)
}
