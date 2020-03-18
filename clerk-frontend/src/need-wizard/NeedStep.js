import React, { Component } from 'react';

import CONFIGURATION from '../configuration/clerk-frontend-config.json'
const NEEDS = [
  {
    'predicate': CONFIGURATION.PRODUCTS[0].PRODUCT_NEED,
    'description': 'Uittreksel Basis Registratie Persoonsgegevens'
  },
  {
    'predicate': CONFIGURATION.PRODUCTS[1].PRODUCT_NEED,
    'description': 'Uittreksel Basis Registratie Verblijfplaatshistorie'
  }
]

class NeedStep extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectValue: ""
    };
    
    if (this.props.needChanged) {
      this.props.needChanged(NEEDS[id].predicate)
    }

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleDropdownChange(e) {
    this.setState({ selectValue: e.target.value });
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
          <select id="dropdown" onChange={this.handleDropdownChange}>
            {this.renderOptions()}
          </select>
        </form>
      </div>
    );
  }
}

export default NeedStep;
