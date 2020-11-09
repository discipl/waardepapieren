import { AbundanceService } from '@discipl/abundance-service'
// Specifically importing the server, because the server is not in the index to ensure browser compatibility
import EphemeralServer from '@discipl/core-ephemeral/dist/EphemeralServer'
import UlaServerConnector from '@discipl/core-ula-server';
import { w3cwebsocket } from 'websocket'
import jp from 'jsonpath'
import fs from 'fs'
import * as log from 'loglevel'

class WaardenpapierenService {
  constructor(core) {
    this.core = core
  }
  async start(configuration) {
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

    if (this.configuration.ENABLE_IPV8_ATTESTATION) {
      const ipv8connector = await core.getConnector('ipv8')
      ipv8connector.configure('https://clerk-frontend/api/ipv8/service')
      
    }

    if (this.configuration.ENABLE_ULA_SERVER_ATTESTATION) {
      core.registerConnector("ula-server", new UlaServerConnector())
      const ulaConnector = await core.getConnector('ula-server');
      this.logger.debug("PRECONFIG", this.configuration.ULA_SERVER_ENDPOINT, this.configuration.ULA_BASIC_AUTH);
      ulaConnector.configure(this.configuration.ULA_SERVER_ENDPOINT, this.configuration.ULA_BASIC_AUTH);
      this.logger.debug("POSTCONFIG", ulaConnector);
    }

    await attendResult.observableResult.subscribe(async (need) => {
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

  async serveNeed(need, nlxIdentity) {
    let logId = Math.floor(Math.random() * 10000);
    this.logger.info('Serving need ', logId)
    let core = this.abundance.getCoreAPI()

    let needDetails = await need
    let argumentClaim = await needDetails.informationPromise

    this.logger.info('Received BSN ', logId)

    let srcarg = argumentClaim['claim']['data'][this.configuration.SOURCE_ARGUMENT]
    let ipv8TempLink = argumentClaim['claim']['data']['ipv8_link']

    const nlxConnector = await core.getConnector('nlx')
    let nlxpath = this.configuration.SOURCE_NLX_PATH.replace('{' + this.configuration.SOURCE_ARGUMENT + '}', srcarg)
    let identifier = await nlxConnector.claim(null, { 'path': nlxpath, 'params': { [this.configuration.SOURCE_ARGUMENT]: srcarg } })

    let result = await nlxConnector.get(identifier)

    this.logger.info('Retrieved NLX data', logId)

    let resultArray = [{ 'Doel': this.configuration.PRODUCT_PURPOSE }]
    let resultObject = { 'Doel': this.configuration.PRODUCT_PURPOSE }
    for (let field in this.configuration.SOURCE_DATA_SELECTION) {
      let key = Object.keys(this.configuration.SOURCE_DATA_SELECTION[field])[0]
      let path = this.configuration.SOURCE_DATA_SELECTION[field][key]
      let value = jp.query(result, path)

      resultArray.push({ [key]: value[0] })
      resultObject[key] = value[0]
    }

    const productClaim = await core.claim(nlxIdentity, resultArray)
    
    let resultClaimContent = {productClaim}
    if (this.configuration.ENABLE_ULA_SERVER_ATTESTATION) {
        this.logger.debug("PreClaim", productClaim)
        const ulaLink = await core.claim({ did: "did:discipl:ula-server:anonymous"}, {
          "testdocument": {
            "predicates": resultObject
          }
        })

        resultClaimContent['ulaServerClaim'] = ulaLink
    }


    if (this.configuration.ENABLE_IPV8_ATTESTATION) {
      // Claim is now only identified by the attribute name (the need), there should be a check if the data is attested for the correct attribute
      const ipv8PermLink = await core.attest(
        { did: this.configuration.IPV8_SERVICE_DID },
        productClaim,
        ipv8TempLink
      )
      resultClaimContent['ipv8Claim'] =  ipv8PermLink
    } 
    this.logger.debug("PreClaim result", resultClaimContent);
    let resultClaim = await core.claim(nlxIdentity, resultClaimContent)

    await core.allow(nlxIdentity, productClaim, needDetails.theirPrivateDid)
    await core.allow(nlxIdentity, resultClaim, needDetails.theirPrivateDid)
    await this.abundance.offer(needDetails.myPrivateSsid, resultClaim)

    this.logger.info('Served need', logId)
  }

  async stop() {
    try {
      await this.ephemeralServer.close()
    } catch (e) {
      console.log('Error while closing server')
      console.log(e)
    }
  }

  getCoreAPI() {
    return this.abundance.getCoreAPI()
  }
}

export default WaardenpapierenService
