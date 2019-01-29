/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/index'
import * as abundance from 'discipl-abundance-service'

import { take } from 'rxjs/operators'
import sinon from 'sinon'

const EPHEMERAL_ENDPOINT = 'http://localhost:3232'
const EPHEMERAL_WEBSOCKET_ENDPOINT = 'ws://localhost:3233'
const NLX_OUTWAY_ENDPOINT = 'http://localhost:4080'
const BSN_CLAIM_PREDICATE = 'BSN'
const BRP_UITTREKSEL = 'BRP_UITTREKSEL_NEED'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

describe('waardenpapieren-service, integrated with mocked nlx connector', () => {
  it('should serve an expressed need for BRP', async () => {
    let nlxConnector = await abundance.getCoreAPI().getConnector('nlx')

    let nlxClaimStub = sinon.stub(nlxConnector, 'claim').returns('claimId')
    let nlxGetStub = sinon.stub(nlxConnector, 'get').returns({ 'woonplaats': 'Haarlem' })
    let nlxConfigureSpy = sinon.spy(nlxConnector, 'configure')

    abundance.getCoreAPI().registerConnector('nlx', nlxConnector)

    // Set up server
    let waardenpapierenService = new WaardenpapierenService()
    await timeoutPromise(100)
    let serviceSsid = await waardenpapierenService.start(NLX_OUTWAY_ENDPOINT, EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
    await timeoutPromise(100)
    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)

    expect(nlxConfigureSpy.callCount).to.equal(1)
    expect(nlxConfigureSpy.args[0]).to.deep.equal([NLX_OUTWAY_ENDPOINT])

    await timeoutPromise(100)
    let needSsid = await abundance.need('ephemeral', BRP_UITTREKSEL)
    await timeoutPromise(100)
    let attestationObserver = (await abundance.getCoreAPI().observe(serviceSsid, { [needSsid.did]: null })).pipe(take(1)).toPromise()
    await timeoutPromise(100)
    await abundance.getCoreAPI().claim(needSsid, { [BSN_CLAIM_PREDICATE]: '123123123' })
    await timeoutPromise(100)
    let attestation = await attestationObserver
    await timeoutPromise(100)

    // Test observations
    expect(attestation.claim.data[needSsid.did]).to.be.a('string')

    expect(nlxClaimStub.callCount).to.equal(1)
    expect(nlxClaimStub.args[0]).to.deep.equal([null, { 'path': '/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', 'params': { 'burgerservicenummer': '123123123' } }])
    expect(nlxGetStub.callCount).to.equal(1)
    expect(nlxGetStub.args[0]).to.deep.equal(['claimId'])

    let claim = await abundance.getCoreAPI().get(attestation.claim.data[needSsid.did])
    expect(claim.data).to.deep.equal({ 'woonplaats': 'Haarlem' })

    await waardenpapierenService.stop()
  })
})
