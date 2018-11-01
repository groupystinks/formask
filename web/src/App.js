import * as React from 'react';
import './style/App.css';
import Formask from 'formask';
import Input from './custom/Input';
import InputSelect from './custom/InputSelect';
import InputCalendar from './custom/InputCalendar';
import i18n from './i18n/i18n';
import beautify from 'js-beautify'

class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      schema: this.getSchema().validator,
      messages: this.getSchema().messages,
    }
  }

  onSubmit = (values, formaskProps) => {
    console.log('Submitted value: ', values);
    console.log('formaskProps: ', formaskProps);
    if (!formaskProps.isValid) {
      console.error(formaskProps.errors);
    }
    setTimeout(() => {
      formaskProps.setIsSubmitting(false);
    }, 1000);
  }

  getSchema = () => {
    return {
      validator: {
        name: {
          required: true,
          type: 'string'
        },
        favor: {
          required: true,
          type: 'object',
          favorite(target) {
            return target.value === 'chocolate'
          }
        }
      },
      messages: {
        favor: {
          required: 'select field is required',
          favorite: 'Not my favorite',
        },
      }
    }
  }

  render() {
    const { schema, messages } = this.state;
    return (
      <div className="App">
        <Formask
          onSubmit={this.onSubmit}
          // defaultValues={{
          //   controlled: 'hi again',
          //   select: { value: 'strawberry', label: 'Strawberry' },
          //   calendar: {
          //     startValue: moment().startOf('day'),
          //     endValue: moment().endOf('day'),
          //   }
          // }}
          schema={schema}
          errorMessages={messages}
          render={(formaskProps) => {
            const {
              values, isSubmitting, hook,
              reset, setTouches, touches,
              submitHandler,
              errors,
            } = formaskProps;
            return (
            <form onSubmit={submitHandler}>
              <div className='fields-area'>
                <div className='field'>
                  {
                    hook('name')(
                      <Input
                        touch={touches.name}
                        error={errors.name}
                        value={values.name}
                        label={i18n['name']}
                        onChange={
                          (value) => null
                        }
                      />
                    )
                  }
                </div>
                <div className='field'>
                  {
                    hook('favor')(
                      <InputSelect
                        touch={touches.favor}
                        error={errors.favor}
                        label={i18n['favorite.favor']}
                        selectedOption={values.favor}
                      />
                    )
                  }
                </div>
              </div>
              <div className='fields-area'>
                {
                  hook('calendar')(
                    <InputCalendar
                      value={values.calendar}
                      setTouch={() => setTouches({ calendar: true })}
                    />
                  )
                }
              </div>
              <button
                onClick={() => setTouches({ nativehook: true, controlled: true })}
                type="button"
              >
                Set Touches
              </button>
              <button
                onClick={() => reset({ type: 'clean' })}
                type="button"
              >
                Clean Reset
              </button>
              <button
                onClick={() => reset({ type: 'initial' })}
                type="button"
              >
                Initial Reset
              </button>
              <button disabled={isSubmitting} type="submit">Submit</button>
            </form>
            );
          }}
        />
        <h3>Schema Change</h3>
        <textarea
          style={{ width: '80vw', height: '25vh' }}
          onChange={
            e => {
              try {
                const schema = JSON.parse(
                  e.target.value,
                  (key, val) => {
                    if (/function /.test(val)) {
                      const pattern = /function\s+[\w\s]*\(([\w\s,]*)\)[\s\n\t\r\0{\\n]+(.*)[}\s\n\t\r\0]+/gm;
                      const match = pattern.exec(val)
                      const args = match[1].split(',').map(arg => arg.replace(/s/, ''))
                      const body = match[2]
                      const func = new Function(...args, body)
                      return func
                    }
                    return val
                  }
                )
                this.setState({ schema })

              } catch (error){

              }
            }
          }
          defaultValue={
            beautify(JSON.stringify(
              this.state.schema,
              (key, val) => {
                const replaced = `${val}`.replace(/\n/g, '');
                return (typeof val === 'function') ? replaced : val;
              }
            ))
          }
        />
      </div>
    );
  }
}

export default App;
