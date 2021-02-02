import React, { Component } from 'react';
import $ from 'jquery';

class GetStep extends Component {

  constructor(props) {
    super(props);
  }

  qrCodeWalletRequest() {
    return (
      <img src="./assets/images/qrcode.png" alt="QR code"></img>
    )
  }

  qrCodeScanned() {
    setTimeout(function () {
      $('.data-needed').addClass('hidden')
      $('.loading').removeClass('hidden')
    }, 5000)

    return (
      <div class="loader">
      </div>
    )
}

  qrCodeData() {
    setTimeout(function () {
      $('.loading').addClass('hidden')
      $('.success').removeClass('hidden')
    }, 12000)

    return (
      <h3>Gelukt, ga door naar het inzien van de gegevens</h3>
    )
  }
  
  render() {
    return (
      <div className="input need-form">
        <div class="data-needed">
          <h3>Ok, dan heb ik de volgende gegevens nog van je nodig</h3>
          <ul>
            <li>Uittreksel BRP</li>
            <li>Uittreksel Belastingdienst</li>
          </ul>
          <h3>Scan de QR code met je IDA wallet om deze gegevens te delen</h3>
          <div>
            {this.qrCodeWalletRequest()}
          </div>
        </div>
        <div class="loading hidden">
            {this.qrCodeScanned()}
        </div>
        <div class="success hidden">
          {this.qrCodeData()}
        </div>
      </div>
    );
  }
}

export default GetStep;
