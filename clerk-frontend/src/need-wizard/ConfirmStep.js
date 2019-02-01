import React, { Component } from 'react';
import * as abundance from 'discipl-abundance-service'
import { take } from 'rxjs/operators'

const BRP_UITTREKSEL = 'BRP_UITTREKSEL_NEED'
const BSN_CLAIM_PREDICATE = 'BSN'

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
    let needSsid = await abundance.need('ephemeral', BRP_UITTREKSEL)
    await timeoutPromise(100)
    let matchPromise = (await abundance.observe(needSsid.did, 'ephemeral')).pipe(take(1)).toPromise()
    await timeoutPromise(100)

    await abundance.getCoreAPI().claim(needSsid, { [BSN_CLAIM_PREDICATE]: this.props.bsn })
    await timeoutPromise(100)
    let match = await matchPromise

    let personalSsid = match.ssid

    let brpPromise = (await abundance.getCoreAPI().observe(personalSsid, { [BRP_UITTREKSEL]: null }, true)).pipe(take(1)).toPromise()

    let brp = await brpPromise

    this.setState({
      ...this.state,
      'data': brp.claim.data[BRP_UITTREKSEL]
    })
  }

  renderAttributes() {
    let result = []
    if (this.state.data) {
      for (let key of Object.keys(this.state.data)) {
        let value = this.state.data[key]

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
          {this.renderAttributes()}
        </table>
      </div>
    );
  }
}

export default ConfirmStep;
