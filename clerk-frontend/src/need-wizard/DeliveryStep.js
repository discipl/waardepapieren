import React, { Component } from 'react';
import * as abundance from '@discipl/abundance-service'
import * as paperWallet from '@discipl/paper-wallet'
import { take } from 'rxjs/operators'

const BRP_UITTREKSEL_ACCEPT = 'BRP_UITTREKSEL_ACCEPT'
const AGREE = 'Gewaarmerkt digitaal afschrift van gegevens uit de basisregistratie personen (BRP)'

let template = {
  backgroundImage: 'form-assets/another_pdf_template.png',
  logoImage: 'form-assets/logo.png',
  logoWidth: 230,
  logoHeight: 180,
  canvasWidth: 595, // 8.27 inch @ 72 dpi
  canvasHeight: 838, // 11.64 inch @ 72 dpi
  productHeaderFont: 'bold 11.5px helvetica',
  claimDataFont: '11.5px helvetica',
  productHeaderOffsetX: 30,
  productHeaderOffsetY: 170,
  claimDataOffsetX: 40,
  claimDataOffsetY: 255,
  claimDataLineSpacing: 15,
  qrOffsetX: 320,
  qrOffsetY: 420,
  qrWidth: 250,
  qrHeight: 250
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

    await paperWallet.toCanvas(vc, template, this.canvasRef.current)
    let context = this.canvasRef.current.getContext('2d')
    context.beginPath();
    context.moveTo(40, 250);
    context.lineTo(570, 250);
    context.stroke();

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
