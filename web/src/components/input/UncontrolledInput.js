import * as React from 'react';
// uncontrolled component example
export default class UncontrolledInput extends React.Component {

  onChangeHandler = (e) => {
    this.props.onChange && this.props.onChange(e.target.value)
  }

  onBlurHandler = (e) => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render() {
    const {
      defaultValue, error,
      formaskfield, label
    } = this.props;
    return (
      <div className='field-item'>
        <label htmlFor={formaskfield}>{label}</label>
        <input
          id={formaskfield}
          type='text'
          defaultValue={defaultValue}
          onChange={this.onChangeHandler}
          onBlur={this.onBlurHandler}
        />
        <small className='invalid'>{ error.message }</small>
      </div>
    )
  }
}