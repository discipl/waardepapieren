import * as abundance from 'discipl-abundance-service'
import { EphemeralServer } from 'discipl-core-ephemeral'

const BRP_UITTREKSEL = 'BRP_UITTREKSEL_NEED'
const BSN_CLAIM_PREDICATE = 'BSN'

class WaardenpapierenService {
  async start (nlxOutwayEndpoint, ephemeralEndpoint, ephemeralWebsocketEndpoint) {
    // Setup server
    this.ephemeralServer = new EphemeralServer(3232)
    const core = abundance.getCoreAPI()
    const ephemeralConnector = await core.getConnector('ephemeral')
    ephemeralConnector.configure(ephemeralEndpoint, ephemeralWebsocketEndpoint)

    const nlxConnector = await core.getConnector('nlx')
    nlxConnector.configure(nlxOutwayEndpoint)
    let ssid = await abundance.attendTo('ephemeral', BRP_UITTREKSEL)
    let observer = await abundance.observe(ssid.did, 'ephemeral')
    observer.subscribe(async (needClaim) => {
      await this.serveNeed(ssid, needClaim)
    }, (e) => {
      // If connection is dropped by remote peer, this is fine
      if (e.code !== 1006) {
        console.error('Error while listening to need')
        console.error(e)
      }
    })

    return ssid
  }

  async serveNeed (serviceSsid, need) {
    const core = abundance.getCoreAPI()

    let did = 'did:discipl:ephemeral:' + need.ssid.pubkey

    const observer = await core.observe({ did: did }, { [BSN_CLAIM_PREDICATE]: null })

    observer.subscribe(async (bsnClaim) => {
      const bsn = bsnClaim['claim']['data'][BSN_CLAIM_PREDICATE]
      const nlxConnector = await core.getConnector('nlx')
      let identifier = await nlxConnector.claim(null, { 'path': '/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', 'params': { 'burgerservicenummer': bsn } })

      let result = await nlxConnector.get(identifier)

      let personalSsid = await core.newSsid('ephemeral')
      const claimLink = await core.claim(personalSsid, result)
      // TODO the following line should resolve to the same did as above, but it doesnt?
      // let did = 'did:discipl:ephemeral:'+bsnClaim.ssid.pubkey
      await core.attest(serviceSsid, did, claimLink)
    }, (e) => {
      // If connection is dropped by remote peer, this is fine
      if (e.code !== 1006) {
        console.error('Error while listening to BSN Claim')
        console.error(e)
      }
    })
  }

  async stop () {
    try {
      await this.ephemeralServer.close()
    } catch (e) {
      console.log('Error while closing server')
      console.log(e)
    }
  }

  getCoreAPI () {
    return abundance.getCoreAPI()
  }
}

export default WaardenpapierenService
