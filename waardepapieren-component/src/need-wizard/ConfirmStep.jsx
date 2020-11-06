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

    const need = await this.abundance.need('ephemeral', this.props.need)
    let ipv8TempLink = null

    if (this.props.config.ENABLE_IPV8_ATTESTATION) {
      ipv8TempLink = await this.abundance.getCoreAPI().claim(
          { did: this.props.config.IPV8_SITE_DID },
          this.props.need,
          { did: this.props.config.IPV8_SERVICE_DID }
      )
    }

    let observeOffer = await this.abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise

    await this.abundance.getCoreAPI().claim(need.myPrivateSsid, {
      [this.props.config.SOURCE_ARGUMENT]: this.props.bsn,
      ['ipv8_link']: ipv8TempLink
    })

    const result = await observeOffer.resultPromise
    const resultLink = result.claim.data.productClaim
    const resultData = await this.abundance.getCoreAPI().get(resultLink, need.myPrivateSsid)

    if (this.props.ssidsChanged) {
      this.props.ssidsChanged(need.theirPrivateDid, need.myPrivateSsid)
    }

    if (this.props.resultLinkChanged) {
      this.props.resultLinkChanged(resultLink)
    }

    if (result.claim.data.ulaServerClaim) {
      this.props.walletLinkChanged(result.claim.data.ulaServerClaim);
    }

    if (this.props.config.ENABLE_IPV8_ATTESTATION && this.props.qrMetadataChanged) {
      const attestedIpv8Link = result.claim.data.ipv8Claim
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
