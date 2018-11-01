import * as React from 'react';
// uncontrolled component example
export default class Input extends React.Component {

  onChangeHandler = (e) => {
    this.props.onChange && this.props.onChange(e.target.value)
  }

  onBlurHandler = (e) => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render() {
    const {
      value, error,
      formaskfield, label
    } = this.props;
    return (
      <div className='field-item'>
        <label htmlFor={formaskfield}>{label}</label>
        <input
          id={formaskfield}
          type='text'
          value={value}
          onChange={this.onChangeHandler}
          onBlur={this.onBlurHandler}
        />
        <small className='invalid'>{ error.message }</small>
      </div>
    )
  }
}