import React, { Component } from 'react';
import CONFIGURATION from '../configuration/clerk-frontend-config.json'
import * as jsPDF from 'jspdf'
import { PaperWallet } from '@discipl/paper-wallet'

let template = CONFIGURATION.EXPORT_TYPES['@discipl/paper-wallet'].template

class ConfirmStep extends Component {

  constructor(props) {
    super(props);
    this.state = {
      attestationLink : null,
      canvas : null
    }

    this.paperWallet = new PaperWallet(this.props.core)

    this.canvasRef = React.createRef()
  }

  deliveryChanged(canvas) {
    if (this.props.deliveryChanged) {
      this.props.deliveryChanged(canvas)
    }
  }

  async componentDidMount() {
    console.log(this.props)

    const certUrl = process.env.REACT_APP_CERTIFICATE_HOST || CONFIGURATION.DEFAULT_CERTIFICATE_HOST

    let vc = await this.paperWallet.issue(this.props.resultLink, this.props.myPrivateSsid, {'cert': certUrl + '/certs/org.crt'})

    console.log("Issued")

    let pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [595.28, 841.89]
    })

    this.canvasRef.current.width = template.canvasWidth
    this.canvasRef.current.height = template.canvasHeight

    await this.paperWallet.toCanvas(vc, template, this.canvasRef.current)

    let imageData = this.canvasRef.current.toDataURL('image/png')




    pdf.addImage(imageData, 'png', 0, 0, template.canvasWidth, template.canvasHeight)

    this.deliveryChanged(pdf)
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
