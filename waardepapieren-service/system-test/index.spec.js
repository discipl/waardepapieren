/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import WaardenpapierenService from '../src/index'
import * as abundance from 'discipl-abundance-service'

import { take } from 'rxjs/operators'

const EPHEMERAL_ENDPOINT = 'http://localhost:3232'
const EPHEMERAL_WEBSOCKET_ENDPOINT = 'ws://localhost:3233'
const NLX_OUTWAY_ENDPOINT = 'http://localhost:4080'
const BSN_CLAIM_PREDICATE = 'BSN'
const BRP_UITTREKSEL = 'BRP_UITTREKSEL_NEED'

describe('waardenpapieren-service', () => {
  it('should serve an expressed need for BRP', async () => {
    console.log("1")
    // This test requires the mock outway to run.
    let waardenpapierenService = new WaardenpapierenService()
    console.log("2")
    let serviceSsid = await waardenpapierenService.start(NLX_OUTWAY_ENDPOINT, EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
    console.log("3")
    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
    console.log("4")
    let needSsid = await abundance.need('ephemeral', BRP_UITTREKSEL)
    console.log("5")
    let attestLinkObserver = (await abundance.getCoreAPI().observe(serviceSsid, { [needSsid.did]: null })).pipe(take(1)).toPromise()
    console.log("6")
    await abundance.getCoreAPI().claim(needSsid, { [BSN_CLAIM_PREDICATE]: '123123123' })
    console.log("7")
    let attestLink = await attestLinkObserver
    console.log("8")
    expect(attestLink[needSsid.did]).to.be.a('string')

    let claim = await abundance.getCoreAPI().get(attestLink[needSsid.did])

    expect(claim).to.deep.equal({})

    waardenpapierenService.stop()
  })
})
