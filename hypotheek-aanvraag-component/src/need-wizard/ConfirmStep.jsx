import React from 'react';

class ConfirmStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  receiveDataWallet() {
    return (
      <>
        <div class="organization">
          <strong>Gegevens afkomstig van de Gemeente Haarlem</strong>
          <ul>
            <li>Burgerservicenummer: 999994669</li>
            <li>Voorletters: Ż.Å.Đ.</li>
            <li>Voornamen: Żáïŀëñøŕ Åłéèç Đëļŧå</li>
            <li>Geslachtsnaam: Streeveld</li>
            <li>Geboortedatum: 1961-12-30</li>
            <li>Huwelijkse staat: gehuwd</li>
            <li>Straatnaam verblijfadres: Leidsevaart</li>
            <li>Huisnummer verblijfadres: 146</li>
            <li>Postcode verblijfadres: 2014 HE</li>
            <li>Woonplaats verblijfadres: Haarlem</li>
          </ul>
        </div>
        <div class="organization">
          <strong>Gegevens afkomstig van de Belastingdienst</strong>
          <ul>
            <li>Burgerservicenummer: 999994669</li>
            <li>Alimentatieverplichtingen: geen</li>
            <li>Verplichtingen anders dan al bekend bij BKR, dus onderhands DUO: geen</li>
            <li>Inkomen uit onderneming (naast loondienst): geen</li>
            <li>Woning en andere onroerende zaken: geen</li>
            <li>Fiscaal partner: ja</li>
            <li>Eigen bijdrage pensioen: 56,73 euro</li>
          </ul>
        </div>
      </>
    )
  }

  render() {
    return (
      <div>
        <ul className="definition-list definition-list--large-titles">
          {this.receiveDataWallet()}
        </ul>
      </div>
    );
  }
}

export default ConfirmStep;
