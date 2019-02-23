import 'rc-calendar/assets/index.css';
import * as React from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';

// import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';

const now = moment();
now.locale('en-gb').utcOffset(0);

function getFormat(time) {
  return time ? format : 'YYYY-MM-DD';
}


const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

const timePickerElement = <TimePickerPanel />;


const SHOW_TIME = true;

class Picker extends React.Component {
  state = {
    showTime: SHOW_TIME,
    disabled: false,
  };

  render() {
    const props = this.props;
    const calendar = (<Calendar
      locale={enUS}
      timePicker={props.showTime ? timePickerElement : null}
      disabledDate={props.disabledDate}
    />);
    return (<DatePicker
      animation="slide-up"
      disabled={props.disabled}
      calendar={calendar}
      value={props.value}
      onChange={props.onChange}
    >
      {
        ({ value }) => {
          return (
            <span>
                <input
                  placeholder="Please choose date"
                  style={{ width: '100%' }}
                  disabled={props.disabled}
                  readOnly
                  value={value && value.format(getFormat(props.showTime)) || ''}
                />
                </span>
          );
        }
      }
    </DatePicker>);
  }
}

export default class InputCalendar extends React.Component {
  state = {
    startValue: null,
    endValue: null,
  };

  onChange = (field, newvalue) => {
    const { onChange, value, setTouch } = this.props;

    // Custom Touch Field
    if (field === 'endValue') {
      setTouch()
    }

    onChange({
      ...value,
      [field]: newvalue.toDate(),
    })
  }

  render() {
    const {
      value: {startValue, endValue} = {}, formaskfield, error, label
    } = this.props;

    return [
      <div key='start' className='field-item field'>
        <label htmlFor={formaskfield}>{label} -> Start Time</label>
        <Picker
          value={moment(startValue && startValue.valueOf())}
          onChange={this.onChange.bind(this, 'startValue')}
        />
        <small className='invalid'>{ error.message }</small>
      </div>,

      <div key='end' className='field-item field'>
        <label htmlFor={formaskfield}>{label} -> End Time</label>
        <Picker
          value={moment(endValue && endValue.valueOf())}
          onChange={this.onChange.bind(this, 'endValue')}
        />
      </div>
    ];
  }
}