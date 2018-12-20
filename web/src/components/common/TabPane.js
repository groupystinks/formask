import PropTypes from 'prop-types';
import React from 'react';

const TabPane = ({ children, style, className, onClick }) => (
  <div
    className={`nrc-tab-pane ${className}`}
    style={style}
    onClick={() => { onClick(); }}
  >
    {children && children}
  </div>
);

TabPane.propTypes = {
  children: PropTypes.object,
  /** index of the Tab, used to identify which tab is selected */
  index: PropTypes.string.isRequired,
  /** title of the Tab, string or any rendered element */
  tab: PropTypes.node,
  /** Top level custom class */
  className: PropTypes.string,
  /** Top level custom inline style object */
  style: PropTypes.object,
  /** On Clicking handler for each tab */
  onClick: PropTypes.func,
};

TabPane.defaultProps = {
  tab: 'Tab',
  className: '',
  style: {},
  onClick: () => {}
};

export default TabPane;
