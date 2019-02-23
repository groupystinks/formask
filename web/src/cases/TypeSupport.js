import * as React from 'react';
import Input from '../components/input/Input';
import Button from '../components/common/Button';
import i18n from '../i18n/i18n';
import InputSwitch from '../components/input/InputSwitch';
import CheckboxGroup from '../components/input/CheckboxGroup';
import Checkbox from '../components/input/Checkbox';
import Calendar from '../components/input/InputCalendar';
import SubmitMessage from '../components/common/SubmitMessage';
import Formask from 'formask';

const schema = {
  validator: {
    user: {
      required: true,
      type: String,
    },
    age: {
      required: true,
      type: Number,
    },
    married: Boolean,
    instruments: [String],
    daterange: {
      required: true,
      type: {
        startValue: Date,
        endValue: Date,
      },
    }
  },
  messages: {
    user: {
      required: i18n['is.required'],
      type: `${i18n['type.should.be']} String`,
    },
    age: {
      required: i18n['is.required'],
      type: `${i18n['type.should.be']} Number`,
    },
    married: {
      required: i18n['is.required'],
      type: `${i18n['type.should.be']} Boolean`,
    },
    instruments: {
      required: i18n['is.required'],
      type: `${i18n['type.should.be']} Array of String`,
    },
    daterange: {
      required: i18n['is.required'],
      type: `${i18n['type.should.be']} Date`,
    },
  }
}

export default class TypeSupport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitMsg: '',
      msgType: ''
    }
  }
  onSubmit = (values, formaskProps) => {
    setTimeout(() => {
      formaskProps.setIsSubmitting(false);
    }, 1000);
    this.setState({ submitMsg: JSON.stringify(values), msgType: 'value' })
    console.log('formaskProps: ', formaskProps);
    if (!formaskProps.isValid) {
      this.setState({ submitMsg: JSON.stringify(formaskProps.errors), msgType: 'error' })
    }
  }
  render() {
    const { submitMsg, msgType } = this.state;
    return (
      <React.Fragment>
        <Formask
          onSubmit={this.onSubmit}
          schema={schema.validator}
          errorMessages={schema.messages}
          defaultValues={{
            daterange: {startValue: new Date(), endValue: new Date()}
          }}
          render={(formaskProps) => {
            const {
              hook, submitHandler, errors,
              values, touches, isSubmitting,
              setTouches
            } = formaskProps;
            return (
              <form onSubmit={submitHandler}>
                <div className='fields-area'>
                  <div className='field'>
                    {
                      hook('user')(
                        <Input
                          touch={touches.user}
                          error={errors.user}
                          value={values.user}
                          label={'user: String'}
                        />
                      )
                    }
                  </div>
                  <div className='field'>
                    {
                      hook('age')(
                        <Input
                          type='number'
                          touch={touches.age}
                          error={errors.age}
                          value={values.age}
                          label={'age: Number'}
                        />
                      )
                    }
                  </div>
                  <div className='field'>
                    {
                      hook('married')(
                        <InputSwitch
                          touch={touches.married}
                          error={errors.married}
                          value={values.married}
                          label={'married: Boolean'}
                        />
                      )
                    }
                  </div>
                </div>
                <div className='fields-area'>
                  <div className='field'>
                    {
                      hook('instruments')(
                        <CheckboxGroup
                          label={'instruments: Array'}
                          touch={touches.instruments}
                          error={errors.instruments}
                          checklist={values.instruments}
                        >
                          <Checkbox value="guitar" label="Guitar" />
                          <Checkbox value="bass" label="Bass" />
                          <Checkbox value="vocal" label="Vocal" />
                          <Checkbox value={['bassdrum', 'tom-tom']} label="Percussion" />
                        </CheckboxGroup>
                      )
                    }
                  </div>
                </div>
                <div className='fields-area'>
                  <div className='field'>
                    {
                      hook('daterange')(
                        <Calendar
                          setTouch={() => setTouches({ daterange: true })}
                          touch={touches.daterange}
                          error={errors.daterange}
                          value={values.daterange}
                          label={'daterange: Date'}
                        />
                      )
                    }
                  </div>
                </div>
                <div className="flex-hori-spaced">
                  <Button style={{ flex: 1, margin: '10px' }} disabled={isSubmitting} type="submit">{i18n['submit']}</Button>
                  <SubmitMessage message={submitMsg} type={msgType} />
                </div>
              </form>
            );
          }}
        />

      </React.Fragment>
    );
  }
}
