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
          <input type="text" placeholder='Voer BSN in' onChange={this.handleChange}/>
        </form>
      </div>
    );
  }
}

export default BSNStep;
