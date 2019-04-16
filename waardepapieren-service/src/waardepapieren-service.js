import * as abundance from '@discipl/abundance-service'
// Specifically importing the server, because the server is not in the index to ensure browser compatibility
import EphemeralServer from '@discipl/core-ephemeral/dist/EphemeralServer'
import { take } from 'rxjs/operators'
import { w3cwebsocket } from 'websocket'
import jp from 'jsonpath'

class WaardenpapierenService {
  async start (configuration) {
    this.configuration = configuration

    // Setup server
    this.ephemeralServer = new EphemeralServer(3232)
    this.ephemeralServer.start()
    const core = abundance.getCoreAPI()
    const ephemeralConnector = await core.getConnector('ephemeral')
    ephemeralConnector.configure(this.configuration.EPHEMERAL_ENDPOINT, this.configuration.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    const nlxConnector = await core.getConnector('nlx')
    nlxConnector.configure(this.configuration.NLX_OUTWAY_ENDPOINT)
    let attendResult = await abundance.attendTo('ephemeral', this.configuration.PRODUCT_NEED, [this.configuration.SOURCE_ARGUMENT])

    await attendResult.observableResult.subscribe(async (need) => {
      await this.serveNeed(need)
    }, (e) => {
      // If connection is dropped by remote peer, this is fine
      if (e.code !== 1006) {
        console.error('Error while listening to need')
        console.error(e)
      }
    })
  }

  async serveNeed (need) {
    console.log("Serving need")
    let core = abundance.getCoreAPI()

    let needDetails = await need
    console.log("Got needDetails")
    console.log(needDetails)
    let argumentClaim = await needDetails.informationPromise

    console.log("Querying NLX")

    let srcarg = argumentClaim['claim']['data'][this.configuration.SOURCE_ARGUMENT]

    const nlxConnector = await core.getConnector('nlx')
    let nlxpath = this.configuration.SOURCE_NLX_PATH.replace('{'+this.configuration.SOURCE_ARGUMENT+'}', srcarg)
    let identifier = await nlxConnector.claim(null, { 'path': nlxpath, 'params': {[this.configuration.SOURCE_ARGUMENT]:srcarg} })

    let result = await nlxConnector.get(identifier)

    let privateSvcSsid = await core.newSsid('ephemeral') // needs signing with NLX key
    let resultArray = [{'Doel':this.configuration.PRODUCT_PURPOSE}]

    for (let field in this.configuration.SOURCE_DATA_SELECTION) {
      let key = Object.keys(this.configuration.SOURCE_DATA_SELECTION[field])[0]
      let path = this.configuration.SOURCE_DATA_SELECTION[field][key]
      let value = jp.query(result, path)

      resultArray.push({ [key]: value[0] })
    }

    let productClaim = await core.claim(privateSvcSsid, resultArray)

    await core.allow(privateSvcSsid, productClaim, needDetails.theirPrivateDid)

    await abundance.offer(needDetails.myPrivateSsid, productClaim)
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
