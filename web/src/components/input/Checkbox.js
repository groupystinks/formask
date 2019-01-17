import PropTypes from 'prop-types';
import * as React from 'react';
import invariant from 'invariant';

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    invariant(props.value,
      'Property "value" is needed to initiate Checkbox'
    );
  }

  onCheckboxChangeHandler = (e) => { // eslint-disable-line
    if (e instanceof Object) {
      e.preventDefault();
    }

    const { value, readOnly, onChange, checked } = this.props;

    if (readOnly) { return; }

    onChange(value, !checked);
  }

  render() {
    const {
      value, label, checked,
    } = this.props;

    return (
      <span>
        <input
          type="checkbox"
          defaultValue={value}
          checked={checked}
        />
        <label
          className='checkbox'
          onClick={this.onCheckboxChangeHandler}
        >
          {label}
        </label>
      </span>
    );
  }
}

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  /**
   * label's value, what really appear on sreen
   * If label is not set, value would by default put in field of label
  */
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  /**
   * input's value
   * If label is not set, value would by default put in field of label
  */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]).isRequired
};

Checkbox.defaultProps = {
  // checked: false,
  name: '',
  onChange: () => {},
};
