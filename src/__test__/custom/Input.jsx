import * as React from 'react';
export default class Input extends React.Component {

  onChangeHandler = (e) => {
    this.props.onChange && this.props.onChange(e.target.value)
  }

  onBlurHandler = (e) => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render() {
    return (
      <input
        type='text'
        id={this.props.id}
        value={this.props.value}
        onChange={this.onChangeHandler}
        onBlur={this.onBlurHandler}
      />
    )
  }
}