import React from 'react';
import * as jsPDF from 'jspdf'
import { PaperWallet } from '@discipl/paper-wallet'

class ConfirmStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attestationLink : null,
      canvas : null,
      base64 : null,
      jwt: null
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
      base64: vc.qr, // Contains the base 64 png encoding of the VC QR code
      jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpbnRlcmFjdGlvblRva2VuIjp7ImNhbGxiYWNrVVJMIjoiaHR0cDovLzE5Mi4xNjguMi4yNjo5MDAwL2pvbG8vaW50ZXJ4bi9kNzMwODJkZi04M2Q4LTQ5ODUtYWU2OS05NDMzOTA3MDI0YTMiLCJvZmZlcmVkQ3JlZGVudGlhbHMiOlt7InR5cGUiOiJQcm9vZk9mSWRDcmVkZW50aWFsRGVtbyIsInJlbmRlckluZm8iOnsicmVuZGVyQXMiOiJkb2N1bWVudCJ9LCJjcmVkZW50aWFsIjp7Im5hbWUiOiJTU0kgTmF0aW9uYWFsIFNwb29yIC0gVXNlIENhc2UgQmVzbGFndnJpamUgVm9ldCIsImRpc3BsYXkiOnsicHJvcGVydGllcyI6W3sicGF0aCI6WyIkLkJlc2xhZ3ZyaWplIHZvZXQiXSwibGFiZWwiOiJCZWxhc3RpbmdkaWVuc3QiLCJ2YWx1ZSI6IjE1NjMifSx7InBhdGgiOlsiJC5DRFciXSwibGFiZWwiOiJHZXJlY2h0c2RldXJ3YWFyZGVyIiwidmFsdWUiOiJTYW5uZSBWb29yc3BvZWQifSx7InBhdGgiOlsiJC5JbmtvbWVuc3ZlcmhvdWRpbmciXSwibGFiZWwiOiJVV1YiLCJ2YWx1ZSI6IjE4NDYifV19fX1dfSwidHlwIjoiY3JlZGVudGlhbE9mZmVyUmVxdWVzdCIsImlhdCI6MTYyNDk2MzY2MTQ2MiwiZXhwIjoxNjI0OTY3MjYxNDYyLCJqdGkiOiJmYzUxMzc2ODEyMDQyOTk3IiwiaXNzIjoiZGlkOmpvbG86MDhjNGRhZDdlZDdkNTVlMjViNzJlNzVhZWFkNjkyMGJiZjYzYThjMWI4Yjg3Zjc5ZDhlNWMyYjg0MjdmMWY5ZiNrZXlzLTEifQ.nqxDD4QgABxp2TtljN9-Jkm1X-nsJw9tGuI5w22opXFUTHydh7NK-KomWe9KwBFQTXlLh9Fk8_bzef-WJWox1g"
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
        <p>Jolocom JWT:</p>
        <img src={this.state.jwt}></img>
      </div>
    );
  }
}

export default ConfirmStep;
