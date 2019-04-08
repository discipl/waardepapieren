import React, { Component } from 'react';
import * as abundance from '@discipl/abundance-service'
import { take } from 'rxjs/operators'

import CONFIGURATION from '../configuration/wpsvc.json'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

class ConfirmStep extends Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  async componentDidMount() {
    await timeoutPromise(100)
    console.log(CONFIGURATION)
    let needSsid = await abundance.need('ephemeral', CONFIGURATION.PRODUCT_NEED)
    await timeoutPromise(100)
    let matchPromise = (await abundance.observe(needSsid.did, 'ephemeral')).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    await abundance.getCoreAPI().claim(needSsid, { [CONFIGURATION.SOURCE_ARGUMENT]: this.props.bsn })
    await timeoutPromise(100)
    let match = await matchPromise

    let personalDid = match.did

    if (this.props.ssidsChanged) {
      this.props.ssidsChanged(personalDid, needSsid)
    }


    let brpPromise = (await abundance.getCoreAPI().observe(personalDid, null, true)).pipe(take(1)).toPromise()

    let brp = await brpPromise

    console.log(brp)
    this.setState({
      ...this.state,
      'data': brp.claim.data
    })
  }

  renderAttributes() {
    let result = []
    if (this.state.data) {
      for (let keyValue of this.state.data) {
        let key = Object.keys(keyValue)[0]
        let value = keyValue[key]

        if (typeof value !==  'string') {
          value = JSON.stringify(value)
        }


        result.push(<tr><td>{key}</td><td>{value}</td></tr>)
      }

    }

    return result
  }

  render() {
    return (
      <div className="confirmation-data">
        <table>
          <tbody>
            {this.renderAttributes()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ConfirmStep;
