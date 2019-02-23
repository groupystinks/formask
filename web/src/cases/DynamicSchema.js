import * as React from 'react';
import Formask from 'formask';
import Input from '../components/input/Input';
import Button from '../components/common/Button';
import i18n from '../i18n/i18n';
import beautify from 'js-beautify'
import SubmitMessage from '../components/common/SubmitMessage';

function getSchema() {
  return {
    validator: {
      name: {
        required: true,
        type: 'string',
      },
    },
    messages: {
      favor: {
        required: 'select field is required',
      },
    }
  }
}

class DynamicSchema extends React.Component {

  constructor() {
    super();
    this.state = {
      schema: getSchema().validator,
      messages: getSchema().messages,
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
    const { schema, messages, submitMsg, msgType } = this.state;
    return (
      <React.Fragment>
        <Formask
          onSubmit={this.onSubmit}
          schema={schema}
          errorMessages={messages}
          render={(formaskProps) => {
            const {
              values, isSubmitting, hook,
              touches, submitHandler, errors,
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

              </div>
              <div className="flex-hori-spaced">
                <Button style={{ flex: 1, margin: '10px' }} disabled={isSubmitting} type="submit">Submit</Button>
                <SubmitMessage message={submitMsg} type={msgType} />
              </div>
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
                      const func = new Function(...args, body) // eslint-disable-line
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
      </React.Fragment>
    );
  }
}
export default DynamicSchema;
