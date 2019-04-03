/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService, { SOURCE_ARGUMENT, PRODUCT_NEED, PRODUCT_NAME, PRODUCT_ACCEPT } from '../src/waardepapieren-service'
import * as abundance from '@discipl/abundance-service'

import { take } from 'rxjs/operators'
import { w3cwebsocket } from 'websocket'

const EPHEMERAL_ENDPOINT = 'http://localhost:3232'
const EPHEMERAL_WEBSOCKET_ENDPOINT = 'ws://localhost:3233'
const NLX_OUTWAY_ENDPOINT = 'http://localhost:4080'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

describe('waardenpapieren-service', function () {
  it('should serve an expressed need for BRP', async () => {
    // Set up server
    let waardenpapierenService = new WaardenpapierenService()
    await timeoutPromise(100)
    let serviceSsid = await waardenpapierenService.start(NLX_OUTWAY_ENDPOINT, EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
    await timeoutPromise(100)
    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    await timeoutPromise(100)
    let needSsid = await abundance.need('ephemeral', PRODUCT_NEED)

    await timeoutPromise(100)
    let matchPromise = (await abundance.observe(needSsid.did, 'ephemeral')).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    let srcargclaim = await abundance.getCoreAPI().claim(needSsid, { [SOURCE_ARGUMENT]: '663678651' })

    let match = await matchPromise

    await timeoutPromise(100)
    expect(Object.keys(match.claim.data)).to.include(abundance.ABUNDANCE_SERVICE_MATCH_PREDICATE)

    await timeoutPromise(100)
    let attestLinkObserver = (await abundance.getCoreAPI().observe(serviceSsid.did, { [PRODUCT_NAME]: null })).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    // Accept and follow references
    await abundance.getCoreAPI().claim(needSsid, { [PRODUCT_ACCEPT]: '' })

    await timeoutPromise(100)
    let attestLink = await attestLinkObserver
    await timeoutPromise(100)
    expect(attestLink.claim.data[PRODUCT_NAME]).to.be.a('string')
    let claim = await abundance.getCoreAPI().get(attestLink.claim.data[PRODUCT_NAME])
    expect(claim.data[2]).to.deep.equal({burgerservicenummer:'663678651'})

    await waardenpapierenService.stop()
  })
})
