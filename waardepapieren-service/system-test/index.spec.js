/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/waardepapieren-service'
import * as abundance from '@discipl/abundance-service'

import { take } from 'rxjs/operators'
import { w3cwebsocket } from 'websocket'

import CONFIGURATION from '../configuration/wpsvc.json'

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

    CONFIGURATION.NLX_CERT='./system-test/certs/org.crt'
    CONFIGURATION.NLX_KEY='./system-test/certs/org.key'

    let serviceSsid = await waardenpapierenService.start(CONFIGURATION)
    await timeoutPromise(100)
    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(CONFIGURATION.EPHEMERAL_ENDPOINT, CONFIGURATION.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    await timeoutPromise(100)
    let needSsid = await abundance.need('ephemeral', CONFIGURATION.PRODUCT_NEED)

    await timeoutPromise(100)
    let matchPromise = (await abundance.observe(needSsid.did, 'ephemeral')).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    let srcargclaim = await abundance.getCoreAPI().claim(needSsid, { [CONFIGURATION.SOURCE_ARGUMENT]: '663678651' })

    let match = await matchPromise

    await timeoutPromise(100)
    expect(Object.keys(match.claim.data)).to.include(abundance.ABUNDANCE_SERVICE_MATCH_PREDICATE)

    await timeoutPromise(100)
    let attestLinkObserver = (await abundance.getCoreAPI().observe(match.did, { [CONFIGURATION.PRODUCT_NAME]: null })).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    // Accept and follow references
    await abundance.getCoreAPI().claim(needSsid, { [CONFIGURATION.PRODUCT_ACCEPT]: '' })

    await timeoutPromise(100)
    let attestLink = await attestLinkObserver
    await timeoutPromise(100)

    expect(attestLink.claim.data[CONFIGURATION.PRODUCT_NAME]).to.be.a('string')
    let claim = await abundance.getCoreAPI().get(attestLink.claim.data[CONFIGURATION.PRODUCT_NAME])
    expect(claim.data[1]).to.deep.equal({'Burgerservicenummer (BSN)':'663678651'})

    await waardenpapierenService.stop()
  })
})
