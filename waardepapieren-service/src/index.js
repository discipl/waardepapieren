import * as abundance from 'discipl-abundance-service'
import { EphemeralServer } from 'discipl-core-ephemeral'

const BRP_UITTREKSEL = 'BRP_UITTREKSEL_NEED'
const BSN_CLAIM_PREDICATE = 'BSN'

class WaardenpapierenService {
  async start (nlxOutwayEndpoint, ephemeralEndpoint, ephemeralWebsocketEndpoint) {
    console.log("2.1")
    this.ephemeralServer = new EphemeralServer(3232)
    console.log("2.2")
    const core = abundance.getCoreAPI()
    console.log("2.3")
    const ephemeralConnector = await core.getConnector('ephemeral')
    console.log("2.4")
    ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint)

    const nlxConnector = await core.getConnector('nlx')
    nlxConnector.configure(nlxOutwayEndpoint)
    console.log("2.5")
    let ssid = await abundance.attendTo('ephemeral', BRP_UITTREKSEL)
    console.log("2.55")
    let observer = await abundance.observe(ssid.did, 'ephemeral')
    console.log("2.56")
    observer.subscribe(async (needClaim) => {
      console.log('Someone is in need!')
      await this.serveNeed(ssid, needClaim)
    })

    console.log("2.6")
    return ssid
  }

  async serveNeed (serviceSsid, need) {
    const core = abundance.getCoreAPI()

    let did = 'did:discipl:ephemeral:'+need.ssid.pubkey

    console.log('waiting for BSN of ssid: '+did)

    const observer = await core.observe({did:did}, { [BSN_CLAIM_PREDICATE]: null })

    observer.subscribe(async (bsnClaim) => {
      const bsn = bsnClaim['claim']['data'][BSN_CLAIM_PREDICATE]
      console.log('service: BSN info found :'+bsn)
      const nlxConnector = await core.getConnector('nlx')
      //let identifier = await nlxConnector.claim(null, { 'path': '/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', 'params': { 'burgerservicenummer': bsn } })

      let result = {woonplaats:'dummy value'}//await nlxConnector.get(identifier)

      console.log('NLX result value: '+result.value)
      let personalSsid = await core.newSsid('ephemeral')
      console.log('created private channel : '+JSON.stringify(personalSsid))
      const claimLink = await core.claim(personalSsid, result)
      // TODO the following line should resolve to the same did as above, but it doesnt?
      //let did = 'did:discipl:ephemeral:'+bsnClaim.ssid.pubkey
      console.log('service attesting for client did '+did);
      await core.attest(serviceSsid, did, claimLink)
    })

  }


  stop () {
    try {
      this.ephemeralServer.close()
    } finally {}
  }

  getCoreAPI() {
    return abundance.getCoreAPI()
  }

}

export default WaardenpapierenService;
