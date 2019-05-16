/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/waardepapieren-service'
import * as abundance from '@discipl/abundance-service'

import { take } from 'rxjs/operators'
import { w3cwebsocket } from 'websocket'

import CONFIGURATION from '../configuration/waardepapieren-config.json'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

describe('waardenpapieren-service', function () {
  this.timeout(5000)
  it('should serve an expressed need for BRP', async () => {
    let nlxConnector = await abundance.getCoreAPI().getConnector('nlx')

    CONFIGURATION.NLX_CERT='./system-test/certs/org.crt'
    CONFIGURATION.NLX_KEY='./system-test/certs/org.key'

    // Set up server
    let waardenpapierenService = new WaardenpapierenService()
    await waardenpapierenService.start(CONFIGURATION)
    await timeoutPromise(100)

    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(CONFIGURATION.EPHEMERAL_ENDPOINT, CONFIGURATION.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    // Set up need
    let need = await abundance.need('ephemeral', CONFIGURATION.PRODUCT_NEED)

    let observeOffer = await abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise


    await abundance.getCoreAPI().claim(need.myPrivateSsid, {[CONFIGURATION.SOURCE_ARGUMENT]: '663678651'})


    let result = await observeOffer.resultPromise

    expect(result.claim.data).to.deep.equal([
      {
        "Doel": "Bewijs verblijfadres in woonplaats"
      },
      {
        "Burgerservicenummer (BSN)": "663678651"
      },
      {
        "Woonplaats verblijfadres": "Utrecht"
      }
    ])

    await waardenpapierenService.stop()
  })
})
