import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import NrcTabPane from './TabPane';
import '../../style/tabs.css';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    const { defaultActiveIndex, children } = props;
    const tabPanes = React.Children.toArray(children);
    this.state = {
      activeIndex: defaultActiveIndex ? defaultActiveIndex : tabPanes[0].props.index,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.defaultActiveIndex !== nextProps.defaultActiveIndex) {
      this.setState({
        activeIndex: nextProps.defaultActiveIndex
      });
    }
  }

  onTabClick = (index) => {
    if (this.state.activeIndex !== index) {
      this.setState({
        activeIndex: index
      }, this.props.onChange(index));
    }
  }

  getPaneContentByActiveIndex = (activeIndex) => {
    const { hideInavtive } = this.props;
    const tabPanes = React.Children.toArray(this.props.children);

    // show all tabs, not to destroy instance while switching
    if (hideInavtive) {
      return tabPanes.map((pane, index) => {
        if (index + 1 === activeIndex) {
          return (
            <div>
              {pane}
            </div>
          );
        }
        return (
          <div className="nrc-invisible">
            {pane}
          </div>
        );
      });
    }

    let content = null;
    tabPanes.every(pane => {
      if (pane.props.index === activeIndex) {
        content = pane;
        return false;
      }
      return true;
    });
    return content;
  }

  getNavTabClasses = (pane) => {
    const { activeIndex } = this.state;
    const tabClasses = {
      'nrc-tabs-tab': true,
      'active': activeIndex === pane.props.index,
    };

    return tabClasses;
  }

  render() {
    const { children, style, className, classNameForNav } = this.props;
    const { activeIndex } = this.state;
    const tabPanes = React.Children.toArray(children);


    return (
      <div
        className={`nrc-tabs ${className}`}
        style={style}
      >
        <div className={`nrc-tabs-nav ${classNameForNav}`}>
          {tabPanes.map(pane => {
            return (
               <span
                 className={classnames(this.getNavTabClasses(pane))}
                 key={pane.props.index}
                 onClick={() => this.onTabClick(pane.props.index)}
               >
                 {pane.props.tab}
               </span>
             );
          })}
        </div>
        {this.getPaneContentByActiveIndex(activeIndex)}
      </div>
    );
  }
}

Tabs.propTypes = {
  /** NrcTabPane in a row of a Tabs. Only NrcTabPane component is acceptable */
  children: (props) => {
    const children = React.Children.toArray(props.children);

    for (let i = 0; i < children.length; i++) {
      if (children[i].type !== NrcTabPane) {
        return new Error('Tabs only accepts children of type NrcTabPane');
      }
    }

    return null;
  },
  /** Identifing default selected NrcTabPane  */
  defaultActiveIndex: PropTypes.string,
  /** Callback when NrcTabPane is switched  */
  onChange: PropTypes.func,
  /** Style of NrcTabPane, Options: 'line' and 'card' for now */
  type: PropTypes.string,
  /** Top level custom class */
  className: PropTypes.string,
  /** Top level custom nav class */
  classNameForNav: PropTypes.string,
  /** Top level custom inline style object */
  style: PropTypes.object,
  /**
   * If true, inactive tabs will not be destroyed.
   * It will have nrc-invisible className.
   */
  hideInavtive: PropTypes.bool,
};

Tabs.defaultProps = {
  hideInavtive: false,
  onChange: () => {},
  type: 'line',
  className: '',
  classNameForNav: '',
  style: {},
};
