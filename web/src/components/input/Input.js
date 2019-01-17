import * as React from 'react';
// uncontrolled component example
export default class Input extends React.Component {

  onChangeHandler = (e) => {
    let value = e.target.value

    if (this.props.type === 'number') {
      value = Number(e.target.value);
    }

    this.props.onChange && this.props.onChange(value)
  }

  onBlurHandler = (e) => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render() {
    const {
      value, error, type,
      formaskfield, label
    } = this.props;
    return (
      <div className='field-item'>
        <label htmlFor={formaskfield}>{label}</label>
        <input
          id={formaskfield}
          type={type}
          value={value}
          onChange={this.onChangeHandler}
          onBlur={this.onBlurHandler}
        />
        <small className='invalid'>{ error.message }</small>
      </div>
    )
  }
}

Input.defaultProps = {
  type: 'text'
}
