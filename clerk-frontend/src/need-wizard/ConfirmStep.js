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

  renderAttributes() {
    let result = []
    if (this.state.data) {
      for (let keyValue of this.state.data) {
        let key = Object.keys(keyValue)[0]
        let value = keyValue[key]

        if (typeof value !==  'string') {
          value = JSON.stringify(value)
        }


        result.push(
          <li className="definition-list__item definition-list__item--horizontal">
            <div className="definition-list__title">
              {key}
            </div>
            <div className="definition-list__description">
              <p>
                {value}
              </p>
            </div>
          </li>
        )
      }

    }

    return result
  }

  render() {
    return (
      <div>
        <p>
          <strong>
            Controleer onderstaande gegevens:
          </strong>
        </p>
        <ul className="definition-list definition-list--large-titles">
          {this.renderAttributes()}
        </ul>
      </div>
    );
  }
}

export default ConfirmStep;
