/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/waardepapieren-service'
import * as abundance from '@discipl/abundance-service'

import { take } from 'rxjs/operators'
import { w3cwebsocket } from 'websocket'

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

describe('waardenpapieren-service', () => {
  it('should serve an expressed need for BRP', async () => {
    // Set up server
    let waardenpapierenService = new WaardenpapierenService()
    await timeoutPromise(100)
    let serviceSsid = await waardenpapierenService.start(NLX_OUTWAY_ENDPOINT, EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
    await timeoutPromise(100)
    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    await timeoutPromise(100)
    let needSsid = await abundance.need('ephemeral', BRP_UITTREKSEL)
    await timeoutPromise(100)
    let attestLinkObserver = (await abundance.getCoreAPI().observe(serviceSsid.did, { [needSsid.did]: null })).pipe(take(1)).toPromise()
    await timeoutPromise(100)
    await abundance.getCoreAPI().claim(needSsid, { [BSN_CLAIM_PREDICATE]: '123123123' })
    await timeoutPromise(100)
    let attestLink = await attestLinkObserver
    await timeoutPromise(100)
    expect(attestLink.claim.data[needSsid.did]).to.be.a('string')
    let claim = await abundance.getCoreAPI().get(attestLink.claim.data[needSsid.did])
    expect(claim.data).to.deep.equal({ woonplaats: 'dummy value' })

    await waardenpapierenService.stop()
  })
})
