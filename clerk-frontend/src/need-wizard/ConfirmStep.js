import React, { Component } from 'react';

import CONFIGURATION from '../configuration/clerk-frontend-config.json'
import { AbundanceService } from '@discipl/abundance-service'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

class ConfirmStep extends Component {

  constructor(props) {
    super(props);
    this.state = {}

    this.abundance = new AbundanceService(this.props.core)
  }

  async componentDidMount() {
    // added console log for debugging purposes
    console.log('Choosen product',this.props.need)

    await timeoutPromise(100)

    let need = await this.abundance.need('ephemeral', this.props.need)

    let observeOffer = await this.abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise

    await this.abundance.getCoreAPI().claim(need.myPrivateSsid, { [CONFIGURATION.SOURCE_ARGUMENT]: this.props.bsn })


    let result = await observeOffer.resultPromise

    if (this.props.ssidsChanged) {
      this.props.ssidsChanged(need.theirPrivateDid, need.myPrivateSsid)
    }

    if (this.props.resultLinkChanged) {
      this.props.resultLinkChanged(result.link)
    }

    this.setState({
      ...this.state,
      'data': result.claim.data
    })
  }

  renderAttributes() {
    let result = []
    if (this.state.data) {
      for (let keyValue of this.state.data) {
        let key = Object.keys(keyValue)[0]
        let value = keyValue[key]

        if (typeof value ===  'object') {
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
