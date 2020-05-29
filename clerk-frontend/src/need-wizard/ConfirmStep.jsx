import React from 'react';
import { AbundanceService } from '@discipl/abundance-service'

const timeoutPromise = (timeoutMillis) => {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), timeoutMillis)
  })
}

class ConfirmStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.abundance = new AbundanceService(this.props.core)
  }

  async componentDidMount() {
    await timeoutPromise(100)

    const siteDid = 'did:discipl:ipv8:TGliTmFDTFBLOpd7y5Yd9NDKxelDmsACx9I6Go2cK4v8fKBIKzp0KiEjStqcAfSHFfk7KkqbUodAH0iX3nljnd7Y+bj8b0oFUCI='
    const serviceDid = 'did:discipl:ipv8:TGliTmFDTFBLOs9RF8NUdlFdHcJaSZlNH4F0vuwSB3epF8s8ns1NcB4fWcKSQcuWuqj3C/RQIk3fEEwSwpodkfNmJW54loFalTI='

    let need = await this.abundance.need('ephemeral', this.props.need)
    let ipv8TempLink = await this.abundance.getCoreAPI().claim(
      { did: siteDid },
      this.props.need,
      { did: serviceDid }
    )

    let observeOffer = await this.abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise

    await this.abundance.getCoreAPI().claim(need.myPrivateSsid, {
      [this.props.config.SOURCE_ARGUMENT]: this.props.bsn,
      ['ipv8_link']: ipv8TempLink
    })

    const result = await observeOffer.resultPromise
    const attestedIpv8Link = result.claim.data
    const resultLink = result.claim.previous
    const resultData = await this.abundance.getCoreAPI().get(result.claim.previous, need.myPrivateSsid)

    if (this.props.ssidsChanged) {
      this.props.ssidsChanged(need.theirPrivateDid, need.myPrivateSsid)
    }

    if (this.props.resultLinkChanged) {
      this.props.resultLinkChanged(resultLink)
    }

    if (this.props.qrMetadataChanged) {
      this.props.qrMetadataChanged({ ipv8Link: attestedIpv8Link })
    }

    this.setState({
      data: resultData.data
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
          <li className="definition-list__item definition-list__item--horizontal">
            <ul>
              <div className="definition-list__title">
                {k}
              </div>
              <div className="definition-list__description">
                {this.renderAttributes(obj[k])}
              </div>
            </ul>
          </li>
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
    return (
      <div>
        <p>
          <strong>
            Controleer onderstaande gegevens:
          </strong>
        </p>
        <ul className="definition-list definition-list--large-titles">
          {this.renderAttributes(this.state.data)}
        </ul>
      </div>
    );
  }
}

export default ConfirmStep;
