import React from 'react';

class BSNStep extends React.Component {
  handleChange(event) {
    if (this.props.bsnChanged) {
      this.props.bsnChanged(event.target.value)
    }
  }

  render() {
    return (
      <div className="bsn-form">
        <form onSubmit={e => e.preventDefault()}>
          <div className="input">
            <label className="input__label" htmlFor="waardepapieren-bsn">
              Voer BSN in
            </label>
            <input type="text" id="waardepapieren-bsn" className="input__control input__control--large input__control--text" onChange={e => this.handleChange(e)} />
          </div>
        </form>
      </div>
    );
  }
}

export default BSNStep;
