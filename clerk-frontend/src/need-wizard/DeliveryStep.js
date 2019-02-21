import React, { Component } from 'react';
import * as abundance from '@discipl/abundance-service'
import * as paperWallet from '@discipl/paper-wallet'
import { take } from 'rxjs/operators'

const BRP_UITTREKSEL_ACCEPT = 'BRP_UITTREKSEL_ACCEPT'
const AGREE = 'Bewijs inschrijving Haarlem'

let template = {
  backgroundImage: 'form-assets/template.png',
  logoImage: 'form-assets/logo.png',
  logoWidth: 150,
  logoHeight: 150,
  canvasWidth: 595, // 8.27 inch @ 72 dpi
  canvasHeight: 838, // 11.64 inch @ 72 dpi
  productHeaderFont: 'bold 18px helvetica',
  claimDataFont: '8px helvetica',
  productHeaderOffsetX: 125,
  productHeaderOffsetY: 75,
  claimDataOffsetX: 25,
  claimDataOffsetY: 200,
  claimDataLineSpacing: 10,
  qrOffsetX: 225,
  qrOffsetY: 200,
  qrWidth: 350,
  qrHeight: 350
}

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

    console.log(brpClaimLink)

    let vc = await paperWallet.issue(attestationLink)

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
