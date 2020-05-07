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

    const claimerDid = 'did:discipl:ipv8:eyJtaWQiOiIzWjZQTGRPMWVadlc4blRHMkxlaWRDckJmVDA9IiwicHVibGljS2V5IjoiNGM2OTYyNGU2MTQzNGM1MDRiM2E5NzdiY2I5NjFkZjRkMGNhYzVlOTQzOWFjMDAyYzdkMjNhMWE4ZDljMmI4YmZjN2NhMDQ4MmIzYTc0MmEyMTIzNGFkYTljMDFmNDg3MTVmOTNiMmE0YTliNTI4NzQwMWY0ODk3ZGU3OTYzOWRkZWQ4ZjliOGZjNmY0YTA1NTAyMiJ9'
    const attesterDid = 'did:discipl:ipv8:eyJtaWQiOiJ3K1g5RWcrWlhESjA5V3l1MTMvVS83aE1UM1E9IiwicHVibGljS2V5IjoiNGM2OTYyNGU2MTQzNGM1MDRiM2FjZjUxMTdjMzU0NzY1MTVkMWRjMjVhNDk5OTRkMWY4MTc0YmVlYzEyMDc3N2E5MTdjYjNjOWVjZDRkNzAxZTFmNTljMjkyNDFjYjk2YmFhOGY3MGJmNDUwMjI0ZGRmMTA0YzEyYzI5YTFkOTFmMzY2MjU2ZTc4OTY4MTVhOTUzMiJ9'

    let need = await this.abundance.need('ephemeral', this.props.need)
    let ipv8link = await this.abundance.getCoreAPI().claim(
      { did: claimerDid },
      this.props.need,
      { did: attesterDid }
    )

    console.log('ipv8_link', ipv8link)

    let observeOffer = await this.abundance.observeOffer(need.theirPrivateDid, need.myPrivateSsid)
    await observeOffer.readyPromise

    await this.abundance.getCoreAPI().claim(need.myPrivateSsid, {
      [this.props.config.SOURCE_ARGUMENT]: this.props.bsn,
      ['ipv8_link']: ipv8link
    })


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
