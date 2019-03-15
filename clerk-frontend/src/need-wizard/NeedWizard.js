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

    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
    this._first = this._first.bind(this);
    this.bsnChanged = this.bsnChanged.bind(this);
    this.needChanged = this.needChanged.bind(this);
    this.ssidsChanged = this.ssidsChanged.bind(this);
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

  renderButtons() {
    let prevButton = <button onClick={this._prev}>Vorige</button>;
    let nextButton = <button onClick={this._next}>Volgende</button>;
    let wrongInfoButton = <button>Dit klopt niet!</button>;
    let rightInfoButton = <button onClick={this._next}>Dit klopt!</button>;
    let downloadButton = <button>Download</button>; // currently still mock
    let appleWalletButton = <button>Download naar Apple Wallet</button>;
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

  ssidsChanged(personalDid, needSsid) {
    console.log(this)
    this.setState({
      ...this.state,
      'personalDid': personalDid,
      'needSsid': needSsid
    })
  }

  renderStep () {
    switch(this.state.step) {
      case 0:
        return <BSNStep bsnChanged={this.bsnChanged}/>
      case 1:
        return <NeedStep needChanged={this.needChanged}/>
      case 2:
        return <ConfirmStep bsn={this.state.bsn} need={this.state.need} ssidsChanged={this.ssidsChanged}/>
      case 3:
        return <DeliveryStep personalDid={this.state.personalDid} needSsid={this.state.needSsid} />
      default:
        console.log('Unsupported step')
    }
  }

  render() {
    return (
      <div className="NeedWizard">
        <h2>Verstrekken bewijs inschrijving BRP</h2>
        <h3>Gemeentelijk ambtenaar</h3>
        {this.renderStep()}
        {this.renderButtons()}
      </div>
    );
  }
}

export default NeedWizard;
