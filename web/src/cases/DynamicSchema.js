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
        // Unconditional false, edit schema change to see dynamic schema.
        foo() {return false}
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
    const schema = getSchema().validator;
    this.state = {
      schemaRaw: JSON.stringify(
        schema,
        (key, val) => {
          const replaced = `${val}`.replace(/\n/g, '');
          return (typeof val === 'function') ? replaced : val;
        }
      ),
      schema,
      messages: getSchema().messages,
    }
  }

  render() {
    const {
      schema, messages,
      schemaRaw,
    } = this.state;
    return (
      <React.Fragment>
        <Formask
          schema={schema}
          errorMessages={messages}
          render={(formaskProps) => {
            const {
              values, hook, isValid,
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
                <SubmitMessage message={isValid ? JSON.stringify(values) : JSON.stringify(errors)} type={isValid ? 'message' : 'error'} />
              </div>
            </form>
            );
          }}
        />
        <h3>Schema Change</h3>
        <div className="flex-col-spaced">
          <textarea
            style={{ width: '80vw', height: '25vh' }}
            onChange={
              e => {
                this.setState({ schemaRaw: e.target.value });

              }
            }
            defaultValue={
              beautify(schemaRaw)
            }
          />
          <Button
            type="button"
            onClick={() => {
              try {
                const schema = JSON.parse(
                  schemaRaw,
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
            }}
          >
            {i18n['change']}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
export default DynamicSchema;
