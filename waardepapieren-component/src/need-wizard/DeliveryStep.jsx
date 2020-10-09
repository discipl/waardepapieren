import React from 'react';
import * as jsPDF from 'jspdf'
import { PaperWallet } from '@discipl/paper-wallet'

class ConfirmStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attestationLink : null,
      canvas : null,
      base64 : null
    }

    this.template = this.props.config.EXPORT_TYPES['@discipl/paper-wallet'].template
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

    const certHost = process.env.REACT_APP_CERTIFICATE_HOST || this.props.config.DEFAULT_CERTIFICATE_HOST
    const ipv8Host = process.env.REACT_APP_IPV8_HOST
    const vc = await this.paperWallet.issue(this.props.resultLink, this.props.myPrivateSsid, {
      cert: certHost + '/certs/org.crt',
      ipv8endpoint: ipv8Host + ':14412',
      ...this.props.qrMetadata
    })

    this.setState({
      base64: vc.qr // Contains the base 64 png encoding of the VC QR code
    })

    console.log("Issued")
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [595.28, 841.89]
    })

    this.canvasRef.current.width = this.template.canvasWidth
    this.canvasRef.current.height = this.template.canvasHeight

    await this.paperWallet.toCanvas(vc, this.template, this.canvasRef.current)

    let imageData = this.canvasRef.current.toDataURL('image/png')

    pdf.addImage(imageData, 'png', 0, 0, this.template.canvasWidth, this.template.canvasHeight)

    this.deliveryChanged(pdf)
  }

  render() {
    return (
      <div className="delivery-data">
        <canvas id="delivery-canvas" className="responsive" ref={this.canvasRef} />
        <p>Base64 encoding of the VC QR code is:</p>
        <img src={this.state.base64}></img>
      </div>
    );
  }
}

export default ConfirmStep;
