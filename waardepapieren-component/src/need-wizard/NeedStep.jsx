import React, { Component } from 'react';

class NeedStep extends Component {

  constructor(props) {
    super(props);
    const availableNeeds = [
      {
        predicate: this.props.config.PRODUCTS[0].PRODUCT_NEED,
        description: 'Uittreksel Basis Registratie Persoonsgegevens'
      },
      {
        predicate: this.props.config.PRODUCTS[1].PRODUCT_NEED,
        description: 'Uittreksel Basis Registratie Verblijfplaatshistorie'
      },
      {
        predicate: this.props.config.PRODUCTS[2].PRODUCT_NEED,
        description: 'Uittreksel Belastingdienst'
	  }
    ]

    this.state = {
      currentNeed: availableNeeds[0].predicate,
      availableNeeds: availableNeeds
    }

    if (this.props.needChanged) {
      this.props.needChanged(availableNeeds[0].predicate)
    }
  }
  
  needChanged(event) {
    const newNeed = event.target.value
    this.setState({ currentNeed: newNeed }, () => {
      if (this.props.needChanged) {
        this.props.needChanged(newNeed)
      }
    });
  }

  render() {
    return (
      <div className="input need-form">
        <label className="input__label" htmlFor="waardepapieren-keuze">
          Kies uit beschikbare waardepapieren
        </label>
        <select onChange={e => this.needChanged(e)} value={this.state.currentNeed} id="waardepapieren-keuze" className="input__control input__control--xl input__control--select">
          {this.state.availableNeeds.map((need, i) => <option key={i} value={need.predicate}>{need.description}</option>)}
        </select>
      </div>
    );
  }
}

export default NeedStep;
