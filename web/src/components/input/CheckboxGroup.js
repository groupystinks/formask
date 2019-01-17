import * as React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import onFilterChecklist from './helper/filterChecklist';
import '../../style/checkbox.css'

function noop() {}

class CheckboxGroup extends React.Component {

  onChangeHandler = (values, checked) => {
    const { onChange, checklist } = this.props;
    const newChecklist = onFilterChecklist(values, checked, checklist);
    onChange(newChecklist);
  }

  renderCheckbox = (child) => {
    const { readOnly, checklist } = this.props;

    let checked;

    if (Array.isArray(child.props.value)) {
      checked = child.props.value.every(v => checklist.includes(v));
    } else {
      checked = checklist.includes(child.props.value);
    }

    if (child.type.displayName !== 'Checkbox') {
      return React.cloneElement(child,
        {
          readOnly: readOnly || child.props.readOnly,
          onChange: child.props.onChange
        });
    }
    return React.cloneElement(child,
      {
        checked,
        onChange: this.onChangeHandler,
        readOnly,
      }
    );
  }

  render() {
    const {
      className, children, label,
      error,
    } = this.props;
    const classes = {
      'formask-checkbox': true,
      'field-item': true,
      [className]: !!className,
    };
    return (
      <div
        className={`${classnames(classes)}`}
      >
        <label>{label}</label>
        <div>{React.Children.map(children, this.renderCheckbox)}</div>
        <small className='invalid'>{ error.message }</small>
      </div>
    );
  }
}

CheckboxGroup.propTypes = {
  /**
   * read only
   */
  readOnly: PropTypes.bool,
  /**
   * Controlled value. Use to trace which items are checked.
   */
  checklist: PropTypes.array,
  /**
   * Due to component's controlled design, onChange need to setState checklist and pass it in
   * CheckboxGroup as props.
   */
  onChange: PropTypes.func,
  /**
   * Wrapper's class name.
   */
  className: PropTypes.string,
  /**
   * Normally you would want to pass Checkbox as children. But it's not limited.
   * If it's not Checkbox, CheckboxGroup will not trace its checked status.
   */
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

CheckboxGroup.defaultProps = {
  checklist: [],
  onChange: noop,
};

export default CheckboxGroup;
