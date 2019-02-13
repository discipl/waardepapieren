/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService, { BSN_CLAIM_PREDICATE, BRP_UITTREKSEL, BRP_UITTREKSEL_ACCEPT, AGREE } from '../src/waardepapieren-service'
import * as abundance from '@discipl/abundance-service'
import { w3cwebsocket } from 'websocket'

import { take } from 'rxjs/operators'
import sinon from 'sinon'

const EPHEMERAL_ENDPOINT = 'http://localhost:3232'
const EPHEMERAL_WEBSOCKET_ENDPOINT = 'ws://localhost:3233'
const NLX_OUTWAY_ENDPOINT = 'http://localhost:4080'

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
    await waardenpapierenService.start(NLX_OUTWAY_ENDPOINT, EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
    await timeoutPromise(100)
    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    expect(nlxConfigureSpy.callCount).to.equal(1)
    expect(nlxConfigureSpy.args[0]).to.deep.equal([NLX_OUTWAY_ENDPOINT])

    await timeoutPromise(100)
    let needSsid = await abundance.need('ephemeral', BRP_UITTREKSEL)
    await timeoutPromise(100)
    let matchPromise = (await abundance.observe(needSsid.did, 'ephemeral')).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    await abundance.getCoreAPI().claim(needSsid, { [BSN_CLAIM_PREDICATE]: '123123123' })
    await timeoutPromise(100)
    let match = await matchPromise

    await timeoutPromise(100)
    expect(Object.keys(match.claim.data)).to.include(abundance.ABUNDANCE_SERVICE_MATCH_PREDICATE)

    // Test observations
    expect(nlxClaimStub.callCount).to.equal(1)
    expect(nlxClaimStub.args[0]).to.deep.equal([null, { 'path': '/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', 'params': { 'burgerservicenummer': '123123123' } }])
    expect(nlxGetStub.callCount).to.equal(1)
    expect(nlxGetStub.args[0]).to.deep.equal(['claimId'])

    let personalSsid = match.ssid

    let brpPromise = (await abundance.getCoreAPI().observe(personalSsid, { [BRP_UITTREKSEL]: null }, true)).pipe(take(1)).toPromise()

    let brp = await brpPromise

    expect(brp).to.deep.equal({
      'claim': {
        'data': {
          'BRP_UITTREKSEL_NEED': {
            'woonplaats': 'Haarlem'
          }
        },
        'previous': null
      },
      'ssid': {
        'did': personalSsid.did
      }
    })

    let agreePromise = (await abundance.getCoreAPI().observe(personalSsid, { [AGREE]: null })).pipe(take(1)).toPromise()

    // Accept and follow references
    await abundance.getCoreAPI().claim(needSsid, { [BRP_UITTREKSEL_ACCEPT]: '' })

    let agree = await agreePromise

    expect(agree.claim.data[AGREE]).to.be.a('string')

    let attestationLink = agree.claim.data[AGREE]

    let attestation = await abundance.getCoreAPI().get(attestationLink)

    expect(attestation.data[AGREE]).to.be.a('string')

    let brpClaimLink = attestation.data[AGREE]

    let brpClaim = await abundance.getCoreAPI().get(brpClaimLink)

    expect(brp.claim.data).to.deep.equal(brpClaim.data)

    await waardenpapierenService.stop()
  })
})
