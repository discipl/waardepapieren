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
    
  // Used example code from: https://stackblitz.com/edit/react-ymwpeu

  handleChange = (e) => {
   
    //var index = e.nativeEvent.target.selectedIndex;
    //var text =e.nativeEvent.target[index].text;
    this.setState({type:e.target.value})  
  }

  if (this.props.needChanged) {
      this.props.needChanged(NEEDS[e.nativeEvent.target.selectedIndex].predicate)
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
          <select value={this.state.type}  onChange={this.handleChange}>
            {this.renderOptions()}
          </select>
        </form>
      </div>
    );
  }
}

export default NeedStep;
