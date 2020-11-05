
import 'isomorphic-fetch'
import { BaseConnector } from '@discipl/core-baseconnector'

class UlaServerConnector extends BaseConnector {

  /**
   *  Returns the name of this connector. Mainly used in did and link constructions.
   *
   * @returns {string} The string 'ephemeral'.
   */
  getName () {
    return 'ula-server'
  }

  

  configure (serverEndpoint, basicAuth) {
    this.serverEndpoint = serverEndpoint;
    this.basicAuth = basicAuth;
  }

  async claim(did, _privkey, data) {
    const body = {
        "toAttest": data,
        "toVerify": [],
        "userId": did
      }

    const result = await fetch(this.serverEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Basic " + this.basicAuth
        },
        body: JSON.stringify(body)
    })

    const response = await result.json();

    return this.linkFromReference(Buffer.from(JSON.stringify(response)).toString('base64'));
  }

  getDidOfClaim () {
    // TODO: Fill in, maybe
  }
  
  getLatestClaim() {
      throw new Error("Unsupported method")
  }
  
  newIdentity() {
    throw new Error("Unsupported method")
  }

  get(link, _did = null, _privkey = null) {
    const reference = BaseConnector.referenceFromLink(link);

    return JSON.parse(Buffer.from(reference, 'base64').toString('utf8'));
  }

  observe() {
    throw new Error("Unsupported method")
  }
}

export default UlaServerConnector;