import React, { Component } from 'react';
import { shape, string, func } from 'prop-types';
import { Select } from 'grommet';
import { keys, filter } from 'lodash';
import {inject, observer} from "mobx-react";
import { toJS } from 'mobx';

@inject("appstate")
@observer
class CurrencySelect extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.defaultOptions = [];
    this.getOptions = this.getOptions.bind(this);
    this.observerJSON = toJS(this.props.appstate.items[0]);
    this.getOptions(this.observerJSON);
    this.props.exchangeValueCallback(this.observerJSON[value]);
    this.state = { options: this.defaultOptions, value };
  }
  onSearch = text => {
    const exp = new RegExp(text, 'i');
    this.setState({
      options: this.defaultOptions.filter(o => exp.test(o))
    });
  };
  onClose = () => this.setState({ options: this.defaultOptions });
  onChange = ({ option }) => {
    const { setOptionParent, exchangeValueCallback } = this.props;
    setOptionParent(option);
    exchangeValueCallback(this.observerJSON[option]);
    this.setState({ value: option });
  };
  getOptions = (items) => keys(items).map(option => this.defaultOptions.push(option));
  render() {
    const { options, value } = this.state;
    return (
      <Select
        size="medium"
        placeholder="Select"
        value={value}
        options={options}
        onChange={this.onChange}
        onClose={this.onClose}
        onSearch={this.onSearch}
      />
    );
  }
}

CurrencySelect.propTypes = {
  setOptionParent: func.isRequired,
  exchangeValueCallback: func.isRequired,
  value: string,
};

CurrencySelect.defaultProps = {
  value: '',
};

export default CurrencySelect;
