import React, { Component } from 'react';


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
    await timeoutPromise(100)

    let need = await this.abundance.need('ephemeral', this.props.need)

    let observeOffer = await this.abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise

    await this.abundance.getCoreAPI().claim(need.myPrivateSsid, { [this.props.config.SOURCE_ARGUMENT]: this.props.bsn })


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


  renderAttributes(obj) {
    const result = []
    if (Array.isArray(obj)) {
      for (const element of obj) {
        result.push(
          <li className="definition-list__item definition-list__item--horizontal">
            <div className="definition-list__title">
              {this.renderAttributes(element)}
            </div>
          </li>
        )
      }
    }
    else if (typeof obj === 'object' && obj !== null) {
      for (const k of Object.keys(obj)) {
        result.push(
          <ul>
          <li className="definition-list__item definition-list__item--horizontal">
            <div className="definition-list__title">
              {k}
            </div>
            <div className="definition-list__description">
              {this.renderAttributes(obj[k])}
            </div>
          </li>
          </ul>
        )
      }
    }
    else {
      result.push(
        <p>
          {obj}
        </p>
      )
    }
    return result
  }

  render() {
    let result = [];
    return (
      <div>
        <p>
          <strong>
            Controleer onderstaande gegevens:
          </strong>
        </p>
        <ul className="definition-list definition-list--large-titles">
          {this.renderAttributes(this.state.data, result)}
        </ul>
      </div>
    );
  }
}

export default ConfirmStep;
