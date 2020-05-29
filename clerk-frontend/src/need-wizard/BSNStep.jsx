import React from 'react';

const BSNStep = function(props) {
  function handleBsnChange(event) {
    if (props.bsnChanged) {
      props.bsnChanged(event.target.value)
    }
  }

  return (
    <div className="bsn-form">
      <form onSubmit={e => e.preventDefault()}>
        <div className="input">
          <label className="input__label" htmlFor="waardepapieren-bsn">
            Voer BSN in
          </label>
          <input type="text" id="waardepapieren-bsn" className="input__control input__control--large input__control--text" onChange={handleBsnChange} />
        </div>
      </form>
    </div>
  );
}

export default BSNStep;
