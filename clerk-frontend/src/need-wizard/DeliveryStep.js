import React, { Component } from 'react';
import * as abundance from '@discipl/abundance-service'
import * as paperWallet from '@discipl/paper-wallet'
import { take } from 'rxjs/operators'
import { createCanvas, loadImage } from 'canvas'

const PRODUCT_ACCEPT = 'BRP_UITTREKSEL_ACCEPT'
const PRODUCT_NAME= 'Gewaarmerkt digitaal afschrift van gegevens uit de basisregistratie personen (BRP)'

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
  productHeaderText: PRODUCT_NAME,
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
    this.state = {
      attestationLink : null,
      canvas : null
    }

    this.canvasRef = React.createRef()
  }

  deliveryChanged(link,vc) {
    if (this.props.deliveryChanged) {
      this.props.deliveryChanged(link,vc)
    }
  }

  async componentDidMount() {
    console.log(this.props)

    let agreePromise = (await abundance.getCoreAPI().observe(this.props.personalDid, { [PRODUCT_NAME]: null })).pipe(take(1)).toPromise()

    // Express acceptance of document
    await abundance.getCoreAPI().claim(this.props.needSsid, { [PRODUCT_ACCEPT]: '' })

    let agree = await agreePromise
    // Get attes
    let attestationLink = agree.claim.data[PRODUCT_NAME]
    let attestation = await abundance.getCoreAPI().get(attestationLink)

    let brpClaimLink = attestation.data[PRODUCT_NAME]

    console.log(brpClaimLink)

    let vc = await paperWallet.issue(attestationLink)

    console.log(vc)

    this.canvasRef.current.width = paperWallet.template.canvasWidth
    this.canvasRef.current.height = paperWallet.template.canvasHeight

    let canvas = createCanvas(paperWallet.template.canvasWidth, paperWallet.template.canvasHeight, 'pdf')
    await paperWallet.toCanvas(vc, template, canvas) //this.canvasRef.current
    let context = canvas.getContext('2d')
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

    // show pdf preview
    this.canvasRef.current.getContext('2d').drawImage(canvas, 0, 0)

    this.deliveryChanged(attestationLink, canvas)
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
