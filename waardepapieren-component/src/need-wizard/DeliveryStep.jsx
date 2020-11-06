import React from 'react';
import * as jsPDF from 'jspdf'
import { PaperWallet } from '@discipl/paper-wallet'
import QRCode from 'qrcode'

import stringify from 'json-stable-stringify'

class ConfirmStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attestationLink : null,
      canvas : null
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

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.walletVc != this.props.walletVc) {
      await this.componentDidMount()
    }
  }

  async componentDidMount() {
    console.log(this.props)
    this.paperWallet = new PaperWallet(this.props.core)

    const certHost = process.env.REACT_APP_CERTIFICATE_HOST || this.props.config.DEFAULT_CERTIFICATE_HOST
    const ipv8Host = process.env.REACT_APP_IPV8_HOST
    const vc = await this.paperWallet.issue(this.props.resultLink, this.props.myPrivateSsid, {
      cert: certHost + '/certs/org.crt',
      ipv8endpoint: ipv8Host + ':14412',
      ...this.props.qrMetadata
    })

    

    console.log("Issued")

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [595.28, 841.89]
    })

    this.canvasRef.current.width = this.template.canvasWidth
    this.canvasRef.current.height = this.template.canvasHeight
    if (this.props.walletVc) {
      console.log("Before walletVc", this)
      const walletVc = await this.createWalletVc(vc);
      await this.paperWallet.toCanvas(walletVc, this.template, this.canvasRef.current)
    }
    else {
      await this.paperWallet.toCanvas(vc, this.template, this.canvasRef.current)
    }
    

    let imageData = this.canvasRef.current.toDataURL('image/png')

    pdf.addImage(imageData, 'png', 0, 0, this.template.canvasWidth, this.template.canvasHeight)

    this.deliveryChanged(pdf)
  }

  async createWalletVc(vc) {
    console.log("Inside function", this)
    const data = await this.paperWallet.core.get(this.props.resultLink);
    let qr = await QRCode.toDataURL(stringify(data))
    let ver = (await QRCode.create(stringify(data))).version
    return {
        claimData: vc.claimData,
        qr: qr,
        version: ver
    }
  }

  render() {
    return (
      <div className="delivery-data">
        <canvas id="delivery-canvas" className="responsive" ref={this.canvasRef} />
      </div>
    );
  }
}

export default ConfirmStep;
