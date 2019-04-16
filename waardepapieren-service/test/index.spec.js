/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/waardepapieren-service'
import * as abundance from '@discipl/abundance-service'
import { w3cwebsocket } from 'websocket'

import { take } from 'rxjs/operators'
import sinon from 'sinon'

import CONFIGURATION from '../configuration/wpsvc.json'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

describe('waardenpapieren-service, integrated with mocked nlx connector', function () {
  this.timeout(5000)
  it('should serve an expressed need for BRP', async () => {
    let nlxConnector = await abundance.getCoreAPI().getConnector('nlx')

    let nlxClaimStub = sinon.stub(nlxConnector, 'claim').returns('claimId')
    let nlxGetStub = sinon.stub(nlxConnector, 'get').returns({ 'burgerservicenummer': '123123123', 'verblijfadres': {'adres':'Markt 3', 'woonplaats': 'Haarlem' }})
    let nlxConfigureSpy = sinon.spy(nlxConnector, 'configure')

    abundance.getCoreAPI().registerConnector('nlx', nlxConnector)

    // Set up server
    let waardenpapierenService = new WaardenpapierenService()
    await waardenpapierenService.start(CONFIGURATION)
    await timeoutPromise(100)

    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(CONFIGURATION.EPHEMERAL_ENDPOINT, CONFIGURATION.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    expect(nlxConfigureSpy.callCount).to.equal(1)
    expect(nlxConfigureSpy.args[0]).to.deep.equal([CONFIGURATION.NLX_OUTWAY_ENDPOINT])


    // Set up need
    let need = await abundance.need('ephemeral', CONFIGURATION.PRODUCT_NEED)

    console.log("SERV INFO")
    console.log(need.serviceInformation)
    console.log(need)

    console.log("Observing offer")
    let observeOffer = await abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise

    await abundance.getCoreAPI().claim(need.myPrivateSsid, {[CONFIGURATION.SOURCE_ARGUMENT]: '123123123'})


    let result = await observeOffer.resultPromise

    expect(result).to.deep.equal({
      "data": [
        {
          "Doel": "Bewijs verblijfadres in woonplaats"
        },
        {
          "Burgerservicenummer (BSN)": "123123123"
        },
        {
          "Woonplaats verblijfadres": "Haarlem"
        }
      ],
      "previous": null
    })

    // Test observations
    expect(nlxClaimStub.callCount).to.equal(1)
    expect(nlxClaimStub.args[0]).to.deep.equal([null, { 'path': '/brp/basisregistratie/natuurlijke_personen/bsn/123123123', 'params': {'BSN':'123123123'} }])
    expect(nlxGetStub.callCount).to.equal(1)
    expect(nlxGetStub.args[0]).to.deep.equal(['claimId'])


    await waardenpapierenService.stop()
  })
})
