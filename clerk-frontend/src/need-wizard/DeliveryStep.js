import React, { Component } from 'react';
import * as abundance from '@discipl/abundance-service'
import * as paperWallet from '@discipl/paper-wallet'
import { take } from 'rxjs/operators'
import { loadImage } from 'canvas'

const BRP_UITTREKSEL_ACCEPT = 'BRP_UITTREKSEL_ACCEPT'
const AGREE = 'Gewaarmerkt digitaal afschrift van gegevens uit de basisregistratie personen (BRP)'

let template = {
  // background
  backgroundImage: 'form-assets/another_pdf_template.png',
  // logo from municipality
  logoImage: 'form-assets/logo.png',
  logoWidth: 210,
  logoHeight: 160,
  logoOffsetX: 0,
  logoOffsetY: 0,
  // logo discipl
  disciplImage: 'form-assets/discipl.png',
  disciplWidth: 90,
  disciplHeight: 90,
  disciplOffsetX: 460,
  disciplOffsetY: 35,
  // canvas size (prone for deletion?)
  canvasWidth: 595, // 8.27 inch @ 72 dpi
  canvasHeight: 838, // 11.64 inch @ 72 dpi
  // header
  productHeaderFont: 'bold 11.5px helvetica',
  productHeaderText: AGREE,
  productHeaderOffsetX: 40,
  productHeaderOffsetY: 190,
  // subheader
  subheaderFont: '11.5px helvetica',
  subheaderText: 'Onderstaand persoon is bij de gemeente Haarlem ingeschreven',
  subheaderOffsetX: 40,
  subheaderOffsetY: 210,
  // claimdata
  claimDataFont: '11.5px helvetica',
  prefixAttributes: true,
  claimDataOffsetX: 40,
  claimDataOffsetY: 255,
  claimDataLineSpacing: 15,
  // QR code
  qrOffsetX: 320,
  qrOffsetY: 420,
  qrWidth: 250,
  qrHeight: 250,
  // footer
  footerFont: '10px helvetica',
  footerWidth: 500,
  footerHeight: 200,
  footerOffsetX: 600,
  footerOffsetY: 30
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
    // Draw logo
    context.drawImage(await loadImage(template.logoImage), template.logoOffsetX, template.logoOffsetY, template.logoWidth, template.logoHeight)
    // draw discipl logo
    context.drawImage(await loadImage(template.disciplImage), template.disciplOffsetX, template.disciplOffsetY, template.disciplWidth, template.disciplHeight)
    // draw product header
    context.font = template.productHeaderFont
    context.fillText(template.productHeaderText, template.productHeaderOffsetX, template.productHeaderOffsetY)
    // draw subheader
    context.font = template.subheaderFont
    context.fillText(template.subheaderText, template.subheaderOffsetX, template.subheaderOffsetY)
    // draw footer
    context.font = template.footerFont
    context.fillText("Dit is een automatisch gegenereerd document en daarom niet ondertekent.", 110, 776)
    context.fillText("De gegevens zijn verkregen via NLX en geborgd in de QR-code", 140, 788)
    context.fillText("U kunt de echtheid van dit document controleren via een bijbehorende app of online", 85, 800)
    // draw a line
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
