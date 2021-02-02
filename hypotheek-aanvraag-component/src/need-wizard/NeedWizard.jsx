import React from 'react'
import './NeedWizard.css'
import StartStep from './StartStep'
import GetStep from './GetStep'
import ConfirmStep from './ConfirmStep'
import CompleteStep from './CompleteStep'

const MAX_STEP = 3;

class NeedWizard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 0
    }

    this.core = props.core;
    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
    this._first = this._first.bind(this);
  }

  _prev() {
    this.setState({
      ...this.state,
      step: this.state.step - 1
    })
  }

  _next() {
    this.setState({
      ...this.state,
      step: this.state.step + 1
    })
  }

  _first() {
    this.setState({
      step: 0
    })
  }

  renderButtons() {
    let prevButton = <span>of naar de <a href="#" onClick={this._prev}>vorige stap</a></span>;
    let nextButton = <button onClick={this._next} className="btn btn--primary">Volgende<i className="btn__icon icon icon-arr-forward" title="Ga naar volgende stap" role=""></i></button>;
    let rightInfoButton = <button className="btn" onClick={this._next}>Afronden<i className="btn__icon icon icon-arr-forward" title="Ga naar de volgende stap" role=""></i></button>;

    let finishButton = <span><a href="#" onClick={this._first}>Naar startpagina</a></span>;

    if (this.state.step === 0) {
      return nextButton;
    }

    if (this.state.step === 2) {
      return [rightInfoButton];
    }

    if (this.state.step === MAX_STEP) {
      return [finishButton];
    }

    return [nextButton, prevButton];
  }

  renderStep () {
    console.log("WizardState", this.state)
    switch(this.state.step) {
      case 0:
        return <StartStep/>
      case 1:
        return <GetStep/>
      case 2:
        return <ConfirmStep/>
      case 3:
        return <CompleteStep/>
        console.log('Unsupported step')
    }
  }

  render() {
    return (
      <div className="NeedWizard">
        <h2 role="heading">
          Hypotheek aanvraag
        </h2>
        {this.renderStep()}
        <div className="input">
          {this.renderButtons()}
        </div>
      </div>
    );
  }
}

export default NeedWizard;
