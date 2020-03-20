import React, { Component } from 'react';

class BSNStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'bsn': ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (this.props.bsnChanged) {
      this.props.bsnChanged(event.target.value)
    }
  }



  render() {
    return (
      <div className="bsn-form">
        <form>
          <div className="input">
            <label className="input__label" htmlFor="waardepapieren-bsn">
              Voer BSN in
            </label>
            <input type="text" id="waardepapieren-bsn" className="input__control input__control--large input__control--text" onChange={this.handleChange} />
          </div>
        </form>
      </div>
    );
  }
}

export default BSNStep;
