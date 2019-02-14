import React, { Component } from 'react';
import * as abundance from '@discipl/abundance-service'
import * as paperWallet from '@discipl/paper-wallet'
import { take } from 'rxjs/operators'

const BRP_UITTREKSEL_ACCEPT = 'BRP_UITTREKSEL_ACCEPT'
const AGREE = 'AGREE'

class ConfirmStep extends Component {

  constructor(props) {
    super(props);
    this.state = {}

    this.canvasRef = React.createRef()
  }

  async componentDidMount() {
    console.log(this.props)

    let agreePromise = (await abundance.getCoreAPI().observe(this.props.personalSsid, { [AGREE]: null })).pipe(take(1)).toPromise()

    // Express acceptance of document
    await abundance.getCoreAPI().claim(this.props.needSsid, { [BRP_UITTREKSEL_ACCEPT]: '' })

    let agree = await agreePromise
    // Get attes
    let attestationLink = agree.claim.data[AGREE]
    let attestation = await abundance.getCoreAPI().get(attestationLink)

    let brpClaimLink = attestation.data[AGREE]


    let vc = await paperWallet.issue(brpClaimLink)

    console.log(vc)

    this.canvasRef.current.width = paperWallet.template.canvasWidth
    this.canvasRef.current.height = paperWallet.template.canvasHeight

    await paperWallet.toCanvas(vc, paperWallet.template, this.canvasRef.current)
  }


  render() {
    return (
      <div className="delivery-data">
        <canvas id="delivery-canvas" ref={this.canvasRef}/>
      </div>
    );
  }
}

export default ConfirmStep;
