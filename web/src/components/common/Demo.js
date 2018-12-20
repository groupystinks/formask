import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Highlight from 'react-highlight';
import Tabs from './Tabs';
import TabPane from './TabPane';

class DemoCode extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    this.state = {
      demoCode: props.sourceCode || '',
    };
  }
  componentDidMount() {
    const { path } = this.props;
    if (path) {
      fetch(`/readFile?filepath=${path}`)
      .then(res => {
        return res.json()
      })
      .then((json) => {
        if (json.file) {
          this.setState({
            demoCode: json.file
          });
        } else {
          alert(json.error);
        }
      });
    }
  }

  render() {
    const Comp = this.props.component;
    return (
      <div>
        <Tabs
          defaultActiveIndex="1"
        >
          <TabPane
            index="1"
            tab="Demo"
          >
            <Comp />
          </TabPane>
          <TabPane
            index="2"
            tab="< >"
          >
            <Highlight>
              {this.state.demoCode}
            </Highlight>
          </TabPane>
          <TabPane
            index="3"
            tab="||"
          >
            <Comp />
            <Highlight>
              {this.state.demoCode}
            </Highlight>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

DemoCode.propTypes = {
  /**
   * Exmaple instance of your component.
  */
  component: PropTypes.func.isRequired,
  /**
   * Path to exmaple component
   * Normally You only need either path or sourceCode specified.
  */
  path: PropTypes.string,
  /**
   * String format of source code of exmaple component.
   * Normally You only need either path or sourceCode specified.
  */
  sourceCode: PropTypes.string,
};

export default DemoCode;
