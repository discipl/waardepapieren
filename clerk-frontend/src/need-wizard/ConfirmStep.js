import React, { Component } from 'react';


import { AbundanceService } from '@discipl/abundance-service'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

let result = [];

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
  
  renderAttributes(obj, recursive) {
    if (!recursive) {
      // Clear existing array - this is required when user selects 'vorige stap' in Clerk Frontend
      result = []
    }
    if (obj) {
      for (var k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null) {
          result.push(
            <li className="definition-list__item definition-list__item--horizontal">
              <div className="definition-list__title">
                {k.toUpperCase()}
              </div>
            </li>
          )
          this.renderAttributes(obj[k], true)
        }
        else {
          result.push(
            <li className="definition-list__item definition-list__item--horizontal">
              <div className="definition-list__title">
                {k}
              </div>
              <div className="definition-list__description">
                <p>
                  {obj[k]}
                </p>
              </div>
            </li>
          )
        }
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
          {this.renderAttributes(this.state.data, false)}
        </ul>
      </div>
    );
  }
}

export default ConfirmStep;
