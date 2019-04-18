import React, { Component } from 'react';
import * as paperWallet from '@discipl/paper-wallet'
import { loadImage } from 'canvas'

import CONFIGURATION from '../configuration/wpsvc.json'

let template = CONFIGURATION.EXPORT_TYPES['@discipl/paper-wallet'].template

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


    let vc = await paperWallet.issue(this.props.resultLink, this.props.myPrivateSsid)

    console.log("Issued")

    this.canvasRef.current.width = template.canvasWidth
    this.canvasRef.current.height = template.canvasHeight


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
    context.fillText("Dit is een automatisch gegenereerd document en daarom niet ondertekend.", 110, 776)
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
