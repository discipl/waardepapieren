import React, { Component } from 'react';

const PRODUCT_NEED = 'BRP_UITTREKSEL_NEED'
const NEEDS = [
  {
    'predicate': PRODUCT_NEED,
    'description': 'Uittreksel Basis Registratie Persoonsgegevens'
  }
]

class NeedStep extends Component {

  constructor(props) {
    super(props);

    if (this.props.needChanged) {
      this.props.needChanged(NEEDS[0].predicate)
    }
  }

  renderOptions() {
    let result = []
    for (let i = 0; i < NEEDS.length; i++) {
      let need = NEEDS[i]
      result.push(<option value={need.predicate}>{need.description}</option>)
    }
    return result
  }

  render() {
    return (
      <div className="need-form">
        <form>
          <select>
            {this.renderOptions()}
          </select>
        </form>
      </div>
    );
  }
}

export default NeedStep;
