import React from 'react';
import * as jsPDF from 'jspdf'
import { PaperWallet } from '@discipl/paper-wallet'

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

  async componentDidMount() {
    console.log(this.props)

    const certHost = process.env.REACT_APP_CERTIFICATE_HOST || this.props.config.DEFAULT_CERTIFICATE_HOST
    const ipv8Host = process.env.REACT_APP_IPV8_HOST
    const vc = await this.paperWallet.issue(this.props.resultLink, this.props.myPrivateSsid, {
      cert: certHost + '/certs/org.crt',
      ipv8endpoint: ipv8Host + ':14412',
      ...this.props.qrMetadata
    })

    console.log("Issued")
    console.log(vc.qr.toString('base64'));
    
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
        <p>Base64 encoding of the QR code is:</p>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATPSURBVO3BQY4cSRIEQdNA/f/Lujz6KYBEejXZsyaCf6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXok5eA/CQ1E5BJzRtAnlBzA+QJNROQn6TmjZOqRSdVi06qFn2yTM0mIE8AuVHzhJobIE+oeUPNJiCbTqoWnVQtOqla9MmXAXlCzRNqboBMQCY1k5o31ExAvgnIE2q+6aRq0UnVopOqRZ/8ckBu1NwAmdRMQG7UTEAmNROQSc1/yUnVopOqRSdViz755dRMQG6ATGqeUDMBmdT8PzupWnRSteikatEnX6bmbwIyqbkBMqmZgDwB5AbIpOYJNf+Sk6pFJ1WLTqoWfbIMyE8CMqmZgNwAmdRMQCY1E5An1ExAngDyLzupWnRSteikahH+kV8MyKTmBsik5gkgT6iZgNyo+c1OqhadVC06qVr0yUtAJjUTkBs1E5An1ExAJjWTmgnIjZobNROQCcik5gkgk5obIJOaCciNmjdOqhadVC06qVr0yT9GzQ2QCcgTQJ4A8oSaCcgE5A0gb6iZgGw6qVp0UrXopGrRJ8uAPAFkUjMBmdTcANmk5gbIjZongExqNgGZ1Gw6qVp0UrXopGrRJ1+mZgIyqZmATGo2qfkmNROQGzU3QG7UvAFkUvPGSdWik6pFJ1WLPvlhap4AcqNmUjMBuVFzA+RGzQRkUjMBuVGzCcik5ptOqhadVC06qVr0yZcBmdTcqLkBcgNkUjMBeUPNBOSbgExqboA8AWRS88ZJ1aKTqkUnVYs+WabmCSCTmgnIDZBJzY2aCciNmgnIjZongNyomYDcqLkB8k0nVYtOqhadVC36ZBmQSc2NmgnIpGYCMqmZgExqJiCTmhsgk5oJyDcBeQLIpOZGzaaTqkUnVYtOqhZ9skzNBOQNIG8AuQEyqbkB8gSQSc0bQG7U/E0nVYtOqhadVC365CU1N2omIJOaCcikZgJyo+YJIE+omYC8AWRS84SaGyA/6aRq0UnVopOqRfhHXgAyqXkCyBNqJiCTmjeAfJOaGyCTmhsgk5oJyKTmm06qFp1ULTqpWoR/5IuAvKFmAjKpmYBMaiYgb6i5ATKp2QRkUnMD5Ak1b5xULTqpWnRSteiTZUAmNW8AeULNE2omIE8AeQLIJiBPqJmAbDqpWnRSteikahH+kV8MyI2aTUBu1ExAnlDzBJBJzd90UrXopGrRSdWiT14C8pPU3Kh5AsikZgJyo2YCMqmZgDwBZFLzBJAbNZtOqhadVC06qVr0yTI1m4D8JCBvqJmATGomIDdq3lBzA2RS88ZJ1aKTqkUnVYs++TIgT6h5Qs0NkCfUPAFkUvMGkE1AJjXfdFK16KRq0UnVok9+OSCTmjeATGpu1NyouVEzAZnUTECeUDMBmdRsOqladFK16KRq0Sf/MUAmNW8AmdTcALlRMwGZ1NyoeUPNBGRS88ZJ1aKTqkUnVYs++TI136RmAjIBmdS8AWRS801AbtRMQCY1E5BJzaaTqkUnVYtOqhZ9sgzITwLyBJA31LwB5AbIb3ZSteikatFJ1SL8I1VLTqoWnVQtOqladFK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkX/AwPBHWocx0EPAAAAAElFTkSuQmCC"></img>
      </div>
    );
  }
}

export default ConfirmStep;
