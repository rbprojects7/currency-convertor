import React from 'react';
import { string, func } from 'prop-types';
import {FormField, TextInput} from "grommet";

const CurrencyInput = ({ label, placeholder, value, onChange }) => (
  <FormField label={label} htmlFor="text-input" style={{ marginTop: '1em' }}>
    <TextInput
        id="text-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
    />
  </FormField>
);

CurrencyInput.propTypes = {
  label: string,
  placeholder: string,
  value: string,
  onChange: func,
};

CurrencyInput.defaultProps = {
    label: '',
    value: '',
    placeholder: '',
    onChange: () => {},
};

export default CurrencyInput;
