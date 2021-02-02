import React from 'react';

class CompleteStep extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="delivery-data">
        <h3>Bedankt voor je hypotheekaanvraag bij ICTUbank,</h3>
        <h3 class="end-application">we gaan ermee aan de slag!</h3>
      </div>
    );
  }
}

export default CompleteStep;
