import React, { Component } from 'react';

class NeedStep extends Component {

  constructor(props) {
    super(props);

    this.needs = [
      {
        'predicate': this.props.config.PRODUCT_NEED,
        'description': this.props.config.PRODUCT_DESCRIPTION
      }
    ]

    if (this.props.needChanged) {
      this.props.needChanged(this.needs[0].predicate)
    }
  }

  needChanged(event) {
    this.setState({ currentNeed: event.target.value });
    if (this.props.needChanged) {
      this.props.needChanged(event.target.value)
    }
  }

  renderOptions() {
    let result = []
    for (let i = 0; i < this.needs.length; i++) {
      let need = this.needs[i]
      result.push(<option value={need.predicate}>{need.description}</option>)
    }
    return result
  }

  render() {
    return (
      <div className="input need-form">
        <label className="input__label" htmlFor="waardepapieren-keuze">
          Kies uit beschikbare waardepapieren
        </label>
        <select id="waardepapieren-keuze" className="input__control input__control--xl input__control--select">
          {this.renderOptions()}
        </select>
      </div>
    );
  }
}

export default NeedStep;
