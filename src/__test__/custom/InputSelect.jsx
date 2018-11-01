import * as React from 'react';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

export default class InputSelect extends React.Component {
  handleChange = (selectedOption) => {
    this.props.onChange && this.props.onChange(selectedOption)
  }

  onBlurHanlder = (e) => {
    this.props.onBlur && this.props.onBlur(e)
  }

  render() {
    const { selectedOption } = this.props;
    return (
      <Select
        id={this.props.id}
        value={selectedOption}
        options={options}
        onChange={this.handleChange}
        onBlur={this.onBlurHanlder}
      />
    );
  }
}