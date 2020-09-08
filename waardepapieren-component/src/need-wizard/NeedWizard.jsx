import React from 'react'
import './NeedWizard.css'
import BSNStep from './BSNStep'
import NeedStep from './NeedStep'
import ConfirmStep from './ConfirmStep'
import DeliveryStep from './DeliveryStep'


const MAX_STEP = 3;

class NeedWizard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0
    }

    this.core = props.core;
    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
    this._first = this._first.bind(this);
    this.bsnChanged = this.bsnChanged.bind(this);
    this.needChanged = this.needChanged.bind(this);
    this.ssidsChanged = this.ssidsChanged.bind(this);
    this.resultLinkChanged = this.resultLinkChanged.bind(this);
    this.deliveryChanged = this.deliveryChanged.bind(this);
    this.qrMetadataChanged = this.qrMetadataChanged.bind(this);
  }

  _prev() {
    this.setState({
      ...this.state,
      step: this.state.step - 1
    })
  }

  _next() {
    this.setState({
      ...this.state,
      step: this.state.step + 1
    })
  }

  _first() {
    this.setState({
      step: 0
    })
  }

  _download(type) {
    if (type === 'paperWallet') {
      this.state.pdf.save('uittreksel.pdf')
    } else {
      window.alert('Download option (' + type + ') not supported...')
    }
  }

  renderButtons() {
    let prevButton = <span>of naar de <a href="#" onClick={this._prev}>vorige stap</a></span>;
    let nextButton = <button onClick={this._next} className="btn btn--primary">Volgende<i className="btn__icon icon icon-arr-forward" title="Ga naar volgende stap" role=""></i></button>;
    let wrongInfoButton = <button className="btn btn--primary">Dit klopt niet!</button>;
    let rightInfoButton = <button className="btn" onClick={this._next}>Dit klopt!<i className="btn__icon icon icon-arr-forward" title="Ga naar de volgende stap" role=""></i></button>;

    let downloadButton = <button className="btn btn--primary" onClick={this._download.bind(this, 'paperWallet')}>Download<i className="btn__icon icon icon-download" title="Download het document" role=""></i></button>; // currently still mock
    let appleWalletButton = <button className="btn btn--primary" onClick={this._download.bind(this, 'appleWallet')}>Download naar Apple Wallet<i className="btn__icon icon icon-folder" title="Download het document" role=""></i></button>;

    let finishButton = <span>of <a href="#" onClick={this._first}>afronden</a></span>;

    if (this.state.step === 0) {
      return nextButton;
    }

    if (this.state.step === 2) {
      return [wrongInfoButton, rightInfoButton, prevButton];
    }

    if (this.state.step === MAX_STEP) {
      return [downloadButton, appleWalletButton, finishButton];
    }

    return [nextButton, prevButton];
  }

  bsnChanged(bsn) {
    this.setState({
      bsn: bsn
    })
  }

  needChanged(need) {
    this.setState({
      need: need
    })
  }

  ssidsChanged(personalDid, myPrivateSsid) {
    this.setState({
      personalDid: personalDid,
      myPrivateSsid: myPrivateSsid
    })
  }

  resultLinkChanged(resultLink) {
    this.setState({
      resultLink: resultLink
    })
  }

  deliveryChanged(pdf) {
    this.setState({
      pdf: pdf
    })
  }

  qrMetadataChanged(metadata) {
    this.setState({
      qrMetadata: metadata
    })
  }

  renderStep () {
    switch(this.state.step) {
      case 0:
        return <BSNStep config={this.props.config} bsnChanged={this.bsnChanged}/>
      case 1:
        return <NeedStep config={this.props.config} needChanged={this.needChanged}/>
      case 2:
        return <ConfirmStep config={this.props.config} core={this.core} bsn={this.state.bsn} need={this.state.need} ssidsChanged={this.ssidsChanged} resultLinkChanged={this.resultLinkChanged} qrMetadataChanged={this.qrMetadataChanged} />
      case 3:
        return <DeliveryStep config={this.props.config} core={this.core} personalDid={this.state.personalDid} myPrivateSsid={this.state.myPrivateSsid} resultLink={this.state.resultLink} qrMetadata={this.state.qrMetadata} deliveryChanged={this.deliveryChanged} />
      default:
        console.log('Unsupported step')
    }
  }

  render() {
    return (
      <div className="NeedWizard">
        <h2 role="heading">
          Verstrekken waardepapier
        </h2>
        {this.renderStep()}
        <div className="input">
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

export default NeedWizard;
