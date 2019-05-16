import React, { Component } from 'react';
import * as paperWallet from '@discipl/paper-wallet'
import CONFIGURATION from '../configuration/clerk-frontend-config.json'
import * as jsPDF from 'jspdf'

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

  deliveryChanged(canvas) {
    if (this.props.deliveryChanged) {
      this.props.deliveryChanged(canvas)
    }
  }

  async componentDidMount() {
    console.log(this.props)

    let vc = await paperWallet.issue(this.props.resultLink, this.props.myPrivateSsid)

    console.log("Issued")

    let pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: [595.28, 841.89]
    })

    this.canvasRef.current.width = template.canvasWidth
    this.canvasRef.current.height = template.canvasHeight

    await paperWallet.toCanvas(vc, template, this.canvasRef.current)

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
