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
    const personalSsid = core.newSsid('ephemeral')

    const observer = await core.observe(need.ssid, { [BSN_CLAIM_PREDICATE]: null }, true)

    observer.subscribe(async (bsnClaim) => {
      const bsn = bsnClaim['claim']['data'][BSN_CLAIM_PREDICATE]
      const nlxConnector = await core.getConnector('nlx')
      let identifier = await nlxConnector.claim(null, { 'path': '/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', 'params': { 'burgerservicenummer': bsn } })

      let result = await nlxConnector.get(identifier)

      const claimLink = await core.claim(personalSsid, result.value)
      await core.attest(serviceSsid, bsnClaim.ssid.pubkey, claimLink)
    })


  }


  stop () {
    this.ephemeralServer.close()
  }
}

export default WaardenpapierenService;