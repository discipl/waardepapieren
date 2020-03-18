import React, { Component } from 'react'; 

class NeedStep extends Component {

  constructor(props) {
    super(props);

    this.needs = [
      {
        'predicate': this.props.config.PRODUCT_NEED,
        'description': 'Uittreksel Basis Registratie Persoonsgegevens'
      }
    ]

    if (this.props.needChanged) {
      this.props.needChanged(this.needs[0].predicate)
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
