/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/index'
import * as abundance from 'discipl-abundance-service'

import { take } from 'rxjs/operators'

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
  it('should serve an expressed need for BRP', () => (async () => {
    try {
      console.log("1")
      // This test requires the mock outway to run.
      let waardenpapierenService = new WaardenpapierenService()
      console.log("2")
      await timeoutPromise(100)
      let serviceSsid = await waardenpapierenService.start(NLX_OUTWAY_ENDPOINT, EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
      console.log("3")
      await timeoutPromise(100)
      let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
      ephemeralConnector.configure(EPHEMERAL_ENDPOINT, EPHEMERAL_WEBSOCKET_ENDPOINT)
      console.log("4")

      await timeoutPromise(100)
      console.log('expressing need')
      let needSsid = await abundance.need('ephemeral', BRP_UITTREKSEL)
      await timeoutPromise(100)
      console.log("5")
      let attestLinkObserver = (await abundance.getCoreAPI().observe(serviceSsid, { [needSsid.did]: null })).pipe(take(1)).toPromise()
      await timeoutPromise(100)
      console.log("6 claiming BSN info for "+needSsid.did)
      await abundance.getCoreAPI().claim(needSsid, { [BSN_CLAIM_PREDICATE]: '123123123' })
      await timeoutPromise(100)
      console.log("7")
      let attestLink = await attestLinkObserver
      await timeoutPromise(100)
      console.log("8")
      console.log(JSON.stringify(attestLink))
      expect(attestLink.claim.data[needSsid.did]).to.be.a('string')
      console.log("9")
      let claim = await abundance.getCoreAPI().get(attestLink.claim.data[needSsid.did])
      console.log("10")
      expect(claim.data).to.deep.equal({woonplaats:'dummy value'})

      await waardenpapierenService.stop()
      console.log("11")
    } catch (e) {
      console.log("Error")
    }

  })().catch(e => console.log("error in test")))
})
