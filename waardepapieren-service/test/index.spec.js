/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import WaardenpapierenService from '../src/waardepapieren-service'
import { AbundanceService } from '@discipl/abundance-service'
import { w3cwebsocket } from 'websocket'
import sinon from 'sinon'

import CONFIGURATION from '../configuration/waardepapieren-config.json'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

const abundance = new AbundanceService()
let waardenpapierenService = null

describe('waardenpapieren-service, integrated with mocked nlx connector', function () {
  this.timeout(5000)

  after(async function () {
    // Ensure the service is stopped after the test to prevent hanging when the test fails
    if (waardenpapierenService) {
      await waardenpapierenService.stop()
    }
  })
  
  it('should serve an expressed need for BRP', async () => {
    let nlxConnector = await abundance.getCoreAPI().getConnector('nlx')
    let nlxClaimStub = sinon.stub(nlxConnector, 'claim').returns('claimId')
    let nlxGetStub = sinon.stub(nlxConnector, 'get').returns({ '_embedded': {
      'ingeschrevenpersonen': [{
          'burgerservicenummer': '123123123',
          'naam': {
            'voorletters': 'A.B.C',
            'geslachtsnaam': 'Streeveld',
          },
          'verblijfplaats': {
            'gemeenteVanInschrijving': {
              'omschrijving': 'Haarlem'
            }
          }
        }]
      }
    })
    let nlxConfigureSpy = sinon.spy(nlxConnector, 'configure')

    abundance.getCoreAPI().registerConnector('nlx', nlxConnector)

    CONFIGURATION.NLX_CERT='./system-test/certs/org.crt'
    CONFIGURATION.NLX_KEY='./system-test/certs/org.key'
    CONFIGURATION.EPHEMERAL_CERT='./system-test/ephemeral-certs/org.crt'
    CONFIGURATION.EPHEMERAL_KEY='./system-test/ephemeral-certs/org.key'
    CONFIGURATION.LOG_LEVEL='info'

    // Set up server
    waardenpapierenService = new WaardenpapierenService(abundance.getCoreAPI())
    await waardenpapierenService.start(CONFIGURATION)
    await timeoutPromise(100)

    let ephemeralConnector = await abundance.getCoreAPI().getConnector('ephemeral')
    ephemeralConnector.configure(CONFIGURATION.EPHEMERAL_ENDPOINT, CONFIGURATION.EPHEMERAL_WEBSOCKET_ENDPOINT, w3cwebsocket)

    expect(nlxConfigureSpy.callCount).to.equal(1)
    expect(nlxConfigureSpy.args[0]).to.deep.equal([CONFIGURATION.NLX_OUTWAY_ENDPOINT])


    // Set up need
    let need = await abundance.need('ephemeral', CONFIGURATION.PRODUCT_NEED)
    let observeOffer = await abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise
    await abundance.getCoreAPI().claim(need.myPrivateSsid, { [CONFIGURATION.SOURCE_ARGUMENT]: '123123123' })


    let result = await observeOffer.resultPromise
    let resultLink = result.claim.data.productClaim
    let resultData = await abundance.getCoreAPI().get(resultLink, need.myPrivateSsid)

    expect(resultData.data).to.deep.equal([
        {
          "Doel": "Bewijs verblijfadres in woonplaats"
        },
        {
          "Burgerservicenummer (BSN)": "123123123"
        },
        {
          "Voorletters": "A.B.C",
        },
        {
          "Geslachtsnaam": "Streeveld",
        },
        {
          "Woonplaats verblijfadres": "Haarlem"
        }
      ])

    // Test observations
    expect(nlxClaimStub.callCount).to.equal(1)
    expect(nlxClaimStub.args[0]).to.deep.equal([null, { 'path': '/brp/basisregistratie/natuurlijke_personen/bsn/123123123', 'params': {'BSN':'123123123'} }])
    expect(nlxGetStub.callCount).to.equal(1)
    expect(nlxGetStub.args[0]).to.deep.equal(['claimId'])

    await waardenpapierenService.stop()
  })
})
