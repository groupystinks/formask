import PropTypes from 'prop-types';
import * as React from 'react';

import '../../style/switch.css';

export class InputSwitch extends React.Component {

  onClickHander = (e) => {
    this.props.onChange && this.props.onChange(!this.props.value);
  }

  render() {
    const {
      value, formaskfield, label, error
    } = this.props;

    const checkedClass = value ? 'checked' : '';

    return (
      <div className={`formask-switch field-item ${checkedClass}`}>
        <label>{label}</label>
        <div
          id={formaskfield}
          className='switcher'
          onClick={this.onClickHander}
        >
        </div>
        <small className='invalid'>{ error.message }</small>
      </div>
    );
  }
}


InputSwitch.propTypes = {
  value: PropTypes.bool,
};

export default InputSwitch;
