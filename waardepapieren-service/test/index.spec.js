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
    await timeoutPromise(100)
    await waardenpapierenService.start(CONFIGURATION)
    await timeoutPromise(100)

    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(CONFIGURATION.EPHEMERAL_ENDPOINT, CONFIGURATION.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    expect(nlxConfigureSpy.callCount).to.equal(1)
    expect(nlxConfigureSpy.args[0]).to.deep.equal([CONFIGURATION.NLX_OUTWAY_ENDPOINT])

    await timeoutPromise(100)
    let needSsid = await abundance.need('ephemeral', CONFIGURATION.PRODUCT_NEED)

    await timeoutPromise(100)
    let matchPromise = (await abundance.observe(needSsid.did, 'ephemeral')).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    await abundance.getCoreAPI().claim(needSsid, { [CONFIGURATION.SOURCE_ARGUMENT]: '123123123' })
    await timeoutPromise(100)
    let match = await matchPromise

    await timeoutPromise(100)
    expect(Object.keys(match.claim.data)).to.include(abundance.ABUNDANCE_SERVICE_MATCH_PREDICATE)

    // Test observations
    expect(nlxClaimStub.callCount).to.equal(1)
    expect(nlxClaimStub.args[0]).to.deep.equal([null, { 'path': '/brp/basisregistratie/natuurlijke_personen/bsn/123123123', 'params': {'BSN':'123123123'} }])
    expect(nlxGetStub.callCount).to.equal(1)
    expect(nlxGetStub.args[0]).to.deep.equal(['claimId'])

    let personalDid = match.did

    let brpPromise = (await abundance.getCoreAPI().observe(personalDid, {}, true)).pipe(take(1)).toPromise()

    let brp = await brpPromise

    expect(brp).to.deep.equal({
      'claim': {
        'data': [
          {'Doel': 'Bewijs verblijfadres in woonplaats'},
          {'Burgerservicenummer (BSN)': '123123123'},
          {'Woonplaats verblijfadres': 'Haarlem'}
        ],
        'previous': null
      },
      'did': personalDid
    })

    let agreePromise = (await abundance.getCoreAPI().observe(personalDid, { [CONFIGURATION.PRODUCT_NAME]: null })).pipe(take(1)).toPromise()

    // Accept and follow references
    await abundance.getCoreAPI().claim(needSsid, { [CONFIGURATION.PRODUCT_ACCEPT]: '' })

    let agree = await agreePromise

    expect(agree.claim.data[CONFIGURATION.PRODUCT_NAME]).to.be.a('string')

    let brpClaimLink = agree.claim.data[CONFIGURATION.PRODUCT_NAME]

    //let attestation = await abundance.getCoreAPI().get(attestationLink)

    //expect(attestation.data[CONFIGURATION.PRODUCT_NAME]).to.be.a('string')

    //let brpClaimLink = attestation.data[CONFIGURATION.PRODUCT_NAME]

    let brpClaim = await abundance.getCoreAPI().get(brpClaimLink)

    expect(brp.claim.data).to.deep.equal(brpClaim.data)

    await waardenpapierenService.stop()
  })
})
