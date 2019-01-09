import React, { Component } from 'react';
import './NeedForm.css';

class NeedForm extends Component {
  render() {
    return (
      <div className="need-form">
        <form>
            <h1>Behoeftenformulier</h1>
            <h2>Gemeentelijk ambtenaar</h2>
            <input type="text" placeholder='Voer BSN in'/>

            <input type='submit' value='Volgende'/>
        </form>
      </div>
    );
  }
}

export default NeedForm;
