/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import UlaServerConnector from '../src/index'


describe('The ULA Server Connector', () => {
    it('should work in integration', async () => {
        const conn = new UlaServerConnector();
        conn.configure(process.env.ULA_ENDPOINT, process.env.ULA_BASIC_AUTH);


        const result = await conn.claim("123123123", "", {"data": "important"})

        expect(result).to.equal({"non": "sensen"})
    })
}
)