import { AbundanceService } from '@discipl/abundance-service'
// Specifically importing the server, because the server is not in the index to ensure browser compatibility
import EphemeralServer from '@discipl/core-ephemeral/dist/EphemeralServer'
import { take } from 'rxjs/operators'
import { w3cwebsocket } from 'websocket'
import jp from 'jsonpath'
import fs from 'fs'
import * as log from 'loglevel'

class WaardenpapierenService {
  constructor (core) {
    this.core = core
  }
  async start (configuration) {
    this.logger = log.getLogger('WaardepapierenService')
    this.configuration = configuration

    if (configuration.LOG_LEVEL) {
      this.logger.setLevel(configuration.LOG_LEVEL)
      log.getLogger('EphemeralConnector').setLevel(configuration.LOG_LEVEL)
    }

    if (this.configuration.EPHEMERAL_START === true) {
      // Setup server
      this.ephemeralServer = new EphemeralServer(3232, configuration.EPHEMERAL_CERT, configuration.EPHEMERAL_KEY, configuration.EPHEMERAL_RETENTION_TIME)
      this.ephemeralServer.start()
    }
    
    this.abundance = new AbundanceService(this.core)
    const core = this.abundance.getCoreAPI()
    const ephemeralConnector = await core.getConnector('ephemeral')
    ephemeralConnector.configure(this.configuration.EPHEMERAL_ENDPOINT, this.configuration.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    let nlxCert = fs.readFileSync(this.configuration.NLX_CERT).toString()
    let nlxKey = fs.readFileSync(this.configuration.NLX_KEY).toString()

    console.log('NLX_CERT', nlxCert)
    let nlxEphemeralIdentity = await ephemeralConnector.newIdentity({ 'cert': nlxCert, 'privkey': nlxKey })

    const nlxConnector = await core.getConnector('nlx')
    nlxConnector.configure(this.configuration.NLX_OUTWAY_ENDPOINT)
    let attendResult = await this.abundance.attendTo('ephemeral', this.configuration.PRODUCT_NEED, [this.configuration.SOURCE_ARGUMENT])

    // TODO: Refactor to observableResult.subscribe when fix from core propagates
    await attendResult.observableResult._observable.subscribe(async (need) => {
      await this.serveNeed(need, nlxEphemeralIdentity)
    }, (e) => {
      // If connection is dropped by remote peer, this is fine
      if (e.code !== 1006) {
        this.logger.error('Error while listening to need')
        this.logger.error(e)
      }
      else {
        this.logger.info('Websocket Connection broke')
      }
    })
    await attendResult.observableResult._readyPromise

    this.logger.info('Serving needs')
  }

  async serveNeed (need, nlxIdentity) {
    let logId = Math.floor(Math.random()*10000);
    this.logger.info('Serving need ', logId)
    let core = this.abundance.getCoreAPI()

    let needDetails = await need
    let argumentClaim = await needDetails.informationPromise

    this.logger.info('Received BSN ', logId)

    let srcarg = argumentClaim['claim']['data'][this.configuration.SOURCE_ARGUMENT]

    const nlxConnector = await core.getConnector('nlx')
    let nlxpath = this.configuration.SOURCE_NLX_PATH.replace('{'+this.configuration.SOURCE_ARGUMENT+'}', srcarg)
    let identifier = await nlxConnector.claim(null, { 'path': nlxpath, 'params': {[this.configuration.SOURCE_ARGUMENT]:srcarg} })

    let result = await nlxConnector.get(identifier)

    this.logger.info('Retrieved NLX data', logId)

    let resultArray = [{'Doel':this.configuration.PRODUCT_PURPOSE}]

    for (let field in this.configuration.SOURCE_DATA_SELECTION) {
      let key = Object.keys(this.configuration.SOURCE_DATA_SELECTION[field])[0]
      let path = this.configuration.SOURCE_DATA_SELECTION[field][key]
      let value = jp.query(result, path)

      resultArray.push({ [key]: value[0] })
    }

    let productClaim = await core.claim(nlxIdentity, resultArray)

    await core.allow(nlxIdentity, productClaim, needDetails.theirPrivateDid)

    await this.abundance.offer(needDetails.myPrivateSsid, productClaim)

    this.logger.info('Served need', logId)
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
    return this.abundance.getCoreAPI()
  }
}

export default WaardenpapierenService
