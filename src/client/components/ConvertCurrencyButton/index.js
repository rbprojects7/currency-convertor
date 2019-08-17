import React, { Component } from 'react';
import { func } from 'prop-types';
import { inject, observer } from "mobx-react";
import { Button } from "grommet";

@inject("appstate")
@observer
class ConvertCurrencyButton extends Component {
  constructor(props) {
    super(props);
    this.getHistoricRates = () => this.props.appstate.fetchRatesHistory('http://data.fixer.io/api', 30);
  }
  convertCurrencyAction = () => {
    this.getHistoricRates();
    this.props.currencyConvertHOC();
  };
  render() {
    return(
      <Button primary label="Convert Currency" onClick={this.convertCurrencyAction} style={{ margin: '1em auto 3em auto' }} />
    );
  }
}

ConvertCurrencyButton.propTypes = {
  currencyConvertHOC: func.isRequired,
};

export default ConvertCurrencyButton;
