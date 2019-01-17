import * as React from 'react';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

export default class InputSelect extends React.Component {
  handleChange = (selectedOption) => {
    this.props.onChange && this.props.onChange(selectedOption)
  }

  onBlurHanlder = (e) => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render() {
    const { 
      selectedOption, formaskfield, label,
      error
    } = this.props;
    return (
      <div className='field-item'>
        <label htmlFor={formaskfield}>{label}</label>
        <Select
          id={formaskfield}
          aria-labelledby={formaskfield}
          styles={{
            control: (styles, state) => ({
              ...styles,
              ':hover': {
                borderColor: state.isFocused ? '#01b1f0' : '#e0e0e0',
              },
              borderColor: state.isFocused ? '#01b1f0' : '#e0e0e0',
              boxShadow: state.isFocused ? '0 0 3px #01b1f0' : '0 0 1px #e0e0e0'
            }),
          }}
          value={selectedOption}
          options={options}
          onChange={this.handleChange}
          onBlur={this.onBlurHanlder}
        />
        <small className='invalid'>{ error.message || '' }</small>
      </div>
    );
  }
}