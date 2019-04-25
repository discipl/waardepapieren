import React, { Component } from 'react';
import * as paperWallet from '@discipl/paper-wallet'
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
