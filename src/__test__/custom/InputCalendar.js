import 'rc-calendar/assets/index.css';
import * as React from 'react';
import Calendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';

import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import 'rc-time-picker/assets/index.css';
import TimePickerPanel from 'rc-time-picker/lib/Panel';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD HH:mm:ss';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

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
      locale={cn ? zhCN : enUS}
      defaultValue={now}
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
                  style={{ width: 250 }}
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
      [field]: newvalue,
    })
  }

  disabledEndDate = (endValue) => {
    if (!endValue) {
      return false;
    }
    const startValue = this.state.startValue;
    if (!startValue) {
      return false;
    }
    return SHOW_TIME ? endValue.isBefore(startValue) :
    endValue.diff(startValue, 'days') <= 0;
  }

  disabledStartDate = (startValue) => {
    if (!startValue) {
      return false;
    }
    const endValue = this.state.endValue;
    if (!endValue) {
      return false;
    }
    return SHOW_TIME ? endValue.isBefore(startValue) :
    endValue.diff(startValue, 'days') <= 0;
  }

  render() {
    const state = this.state;
    const { value: {startValue, endValue} = {} } = this.props;
    return (<div style={{ width: 240, margin: 20 }}>
      <p>
        Start Time:
        <Picker
          disabledDate={this.disabledStartDate}
          value={startValue}
          onChange={this.onChange.bind(this, 'startValue')}
        />
      </p>

      <p>
        End Time:
        <Picker
          disabledDate={this.disabledEndDate}
          value={endValue}
          onChange={this.onChange.bind(this, 'endValue')}
        />
      </p>
    </div>);
  }
}