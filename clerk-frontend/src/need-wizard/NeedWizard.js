import React, { Component } from 'react'
import './NeedWizard.css'
import BSNStep from './BSNStep'
import NeedStep from './NeedStep'
import ConfirmStep from './ConfirmStep'
import DeliveryStep from './DeliveryStep'


const MAX_STEP = 3;

class NeedWizard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      'step': 0
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
  }

  _prev() {
    this.setState({
      ...this.state,
      step: this.state.step-1
    })
  }

  _next() {
    this.setState({
      ...this.state,
      step: this.state.step+1
    })
  }

  _first() {
    this.setState({
      ...this.state,
      step: 0
    })
  }

  _download(type) {
    if(type === 'paperWallet') {
      this.state.pdf.save('uittreksel.pdf')
    } else {
      window.alert('Download option ('+type+') not supported...')
    }
  }

  renderButtons() {
    let prevButton = <button onClick={this._prev}>Vorige</button>;
    let nextButton = <button onClick={this._next}>Volgende</button>;
    let wrongInfoButton = <button>Dit klopt niet!</button>;
    let rightInfoButton = <button onClick={this._next}>Dit klopt!</button>;

    let downloadButton = <button onClick={this._download.bind(this, 'paperWallet')}>Download</button>; // currently still mock
    let appleWalletButton = <button onClick={this._download.bind(this, 'appleWallet')}>Download naar Apple Wallet</button>;

    let finishButton = <button onClick={this._first}>Afronden</button>;

    if (this.state.step === 0) {
      return nextButton;
    }

    if (this.state.step === 2) {
      return [prevButton, wrongInfoButton, rightInfoButton];
    }

    if (this.state.step === MAX_STEP) {
      return [downloadButton, appleWalletButton, finishButton];
    }

    return [prevButton, nextButton];
  }

  bsnChanged(bsn) {
    this.setState({
      ...this.state,
      'bsn': bsn
    })
  }

  needChanged(need) {
    this.setState({
      ...this.state,
      'need': need
    })
  }

  ssidsChanged(personalDid, myPrivateSsid) {

    this.setState({
      ...this.state,
      'personalDid': personalDid,
      'myPrivateSsid': myPrivateSsid
    })
  }

  resultLinkChanged(resultLink) {
    this.setState({
      ...this.state,
      'resultLink': resultLink
    })
  }

  deliveryChanged( pdf) {
    this.setState({
      ...this.state,
      'pdf': pdf
    })
  }

  renderStep () {
    switch(this.state.step) {
      case 0:
        return <BSNStep bsnChanged={this.bsnChanged}/>
      case 1:
        return <NeedStep needChanged={this.needChanged}/>
      case 2:
        return <ConfirmStep core={this.core}bsn={this.state.bsn} need={this.state.need} ssidsChanged={this.ssidsChanged} resultLinkChanged={this.resultLinkChanged}/>
      case 3:
        return <DeliveryStep core={this.core} personalDid={this.state.personalDid} myPrivateSsid={this.state.myPrivateSsid} resultLink={this.state.resultLink} deliveryChanged={this.deliveryChanged} />
      default:
        console.log('Unsupported step')
    }
  }

  render() {
    return (
      <div className="NeedWizard">
        <h2>Verstrekken bewijs inschrijving BRP</h2>
        <h3>door gemeentelijk ambtenaar</h3>
        {this.renderStep()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default NeedWizard;
