import Formask from '../index';
import React from 'react'
import Input from './custom/Input';
import InputSelect from './custom/InputSelect';
import { emailPattern, resolveAfterSeconds } from './helpers';
import { render, fireEvent, cleanup, wait, waitForElement } from 'react-testing-library';

afterEach(cleanup);

/**
 * 1. test onsubmit event, and it will update internal state of Formask.
 * 2. test touches of each field.
 * 3. test values of each field.
 * 4. test errors and isValid of each field.
 * 5. test about defaultValues, defaultTouches and defaultErrors.
 * 6. onBlur a field will trigger field validation.
 * @todo
 * 7. If schema is updated, formask will update schema accordingly and do fields validation
 * 
 */ 

test(`
  When submit button is clicked, onSubmit function should be triggered and called with values(Object)
  and formaskProps(Object)
`, async () => {
  const onSubmit = jest.fn();
  const formask = (
    <Formask
      onSubmit={onSubmit}
      render={formaskProps => {
        const {
          submitHandler, changeHandler, values,
          blurHandler, isSubmitting
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h2>Something In Form</h2>
            <input
              id="first"
              value={values.first}
              onChange={changeHandler}
              onBlur={blurHandler}
            />
            {isSubmitting && <div>submitting...</div>}
            <button type='submit'>
              Submit
            </button>
          </form>
        )
      }}
    />
  );
  const { getByText } = render(formask);

  const leftClick = {button: 0};
  fireEvent.click(getByText('Submit'), leftClick);

  expect(getByText('submitting...')).not.toBeNull();
  /**
   * While submitting, validation process is asynchronous. So use `await wait()` to ensure
   * submit callback is finished before we do validation.
   * 
   * @todo Since validation is asynchronous, is there a way to expose status, thus making unit-test less pain?
   */
  await wait();

  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));

});

test(`
  When user onFocus and onBlur input field, touches will be set.
`, () => {
  const formask = (
    <Formask
      render={formaskProps => {
        const {
          submitHandler, changeHandler, values,
          blurHandler, touches, hook
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h3>First</h3>
            { touches.first && <span>first touched</span> }
            <input
              id="first"
              value={values.first}
              onChange={changeHandler}
              onBlur={blurHandler}
            />
            <h3>Second</h3>
            { touches.second && <span>second touched</span> }
            {
              hook('second')(
                <Input
                  id='second'
                  value={values.controlled}
                />
              )
            }
            <h3>Third</h3>
            { touches.third && <span>third touched</span> }
            {
              hook('third')(
                <InputSelect id='third' selectedOption={values.select} />
              )
            }
          </form>
        )
      }}
    />
  );

  const { getByText } = render(formask);

  expect(() => {getByText('first touched')}).toThrow();
  expect(() => {getByText('second touched')}).toThrow();
  expect(() => {getByText('third touched')}).toThrow();

  const leftClick = {button: 0};
  fireEvent.click(document.getElementById('first'), leftClick);
  fireEvent.blur(document.getElementById('first'));
  fireEvent.click(document.getElementById('second'), leftClick);
  fireEvent.blur(document.getElementById('second'));
  fireEvent.mouseDown(getByText('Select...'));
  
  expect(getByText('first touched')).not.toBeNull();
  expect(getByText('second touched')).not.toBeNull();
  expect(getByText('third touched')).not.toBeNull();

});

test(`
  When user input field value, formask should update its internal state on 'values'.
`, () => {
  const formask = (
    <Formask
      render={formaskProps => {
        const {
          submitHandler, changeHandler, values,
          blurHandler, touches, hook,
          getFieldsValue
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h3>First</h3>
            <input
              id="first"
              value={values.first}
              onChange={changeHandler}
              onBlur={blurHandler}
            />
            <h3>Second</h3>
            {
              hook('second')(
                <Input
                  id='second'
                  value={values.controlled}
                />
              )
            }
            <h3>Third</h3>
            {
              hook('third')(
                <InputSelect id='third' selectedOption={values.select} />
              )
            }
            <span data-testid='values'>{`${JSON.stringify(getFieldsValue())}`}</span>
          </form>
        )
      }}
    />
  );

  const { getByTestId } = render(formask);
  const expected = {
    first: 'hello',
    second: 'world',
  }

  expect(getByTestId('values').innerHTML).toBe('{}');

  fireEvent.change(document.getElementById('first'), {target: {value: 'hello'}});
  fireEvent.change(document.getElementById('second'), {target: {value: 'world'}});
  /**
   * @todo: Test third party field(react-select);
   */
  
  const result = JSON.parse((getByTestId('values').innerHTML))
  expect(result).toEqual(expected);
})

test(`
  If schema and errorMessages are specified in Formask, after validation Formask will produce
  isValid and errors state correctly.
`, async () => {
  const getSchema = () => {
    return {
      validator: {
        first: {
          type: 'string',
          email(target) {
            return emailPattern.test(target)
          }
        },
        second: {
          required: true,
          type: 'string'
        },
      },
      messages: {
        first: {
          email: 'first should be email format',
        },
        second: {
          required: 'second is required',
          type: 'only number will be allowed'
        },
      }
    }
  }
  const formask = (
    <Formask
      schema={getSchema().validator}
      errorMessages={getSchema().messages}
      render={formaskProps => {
        const {
          submitHandler, changeHandler, values,
          blurHandler, errors, hook,
          isValid, validate,
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h3>First</h3>
            <input
              id="first"
              value={values.first}
              onChange={changeHandler}
              onBlur={blurHandler}
            />
            <h3>Second</h3>
            {
              hook('second')(
                <Input
                  id='second'
                  value={values.controlled}
                />
              )
            }
            <span data-testid='errors'>{`${JSON.stringify(errors)}`}</span>
            { isValid && <span>valid</span> }
            <button type='button' onClick={validate}>validate</button>
          </form>
        );
      }}
    />
  );

  const { getByText, getByTestId } = render(formask);

  expect(getByTestId('errors').innerHTML).toBe('{}');

  fireEvent.click(getByText('validate'));
  await wait();

  expect(() => getByText('valid')).toThrow();
  expect(getByTestId('errors').innerHTML).toContain('second is required');

  fireEvent.change(document.getElementById('second'), {target: {value: 'hello second'}});
  fireEvent.click(getByText('validate'));
  await wait();

  expect(getByText('valid')).not.toBeNull();
})


test(`
  Asynchronous validation.
`, async () => {
  const getSchema =  () => {
    return {
      validator: {
        first: {
          type: 'string',
          existedUserId(value) {
            return resolveAfterSeconds(['jasonhot', 'judycold'], 1000)
              .then(results => {
                return !results.includes(value);
              });
          }
        },
      },
      messages: {
        first: {
          existedUserId: 'Userid exists',
        },
      }
    }
  }

  const formask = (
    <Formask
      schema={getSchema().validator}
      errorMessages={getSchema().messages}
      render={formaskProps => {
        const {
          submitHandler, changeHandler, values,
          blurHandler, errors, hook,
          isValid, validate,
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h3>First</h3>
            <input
              id="first"
              value={values.first}
              onChange={changeHandler}
              onBlur={blurHandler}
            />
            <span data-testid='errors'>{`${JSON.stringify(errors)}`}</span>
            { isValid && <span>valid</span> }
            <button type='button' onClick={validate}>validate</button>
          </form>
        );
      }}
    />
  );

  const { getByText, getByTestId } = render(formask);

  expect(getByTestId('errors').innerHTML).toBe('{}');

  fireEvent.change(document.getElementById('first'), {target: {value: 'jasonhot'}});
  fireEvent.click(getByText('validate'));
  await waitForElement(() => getByText('Userid exists', { exact: false }));

  expect(getByText('Userid exists', {exact: false})).not.toBeNull();

  fireEvent.change(document.getElementById('first'), {target: {value: 'jasoncold'}});
  fireEvent.click(getByText('validate'));
  await waitForElement();

  expect(getByText('valid')).not.toBeNull();
});

test(`
  defaultValues, defaultTouches and defaultErrors.
`, () => {
  const defaultValues = {
    first: 'hello',
    second: 'world',
  };
  const defaultErrors = {
    first: {
      valid: true
    },
    second: {
      valid: false,
      error: 'second is initially wrong',
    }
  };
  const defaultTouches = {
    first: false,
    second: true,
  };
  const formask = (
    <Formask
      defaultValues={defaultValues}
      defaultErrors={defaultErrors}
      defaultTouches={defaultTouches}
      render={formaskProps => {
        const {
          submitHandler, changeHandler, values,
          blurHandler, errors, hook,
          touches,
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h3>First</h3>
            <input
              id="first"
              value={values.first}
              onChange={changeHandler}
              onBlur={blurHandler}
            />
            <h3>Second</h3>
            {
              hook('second')(
                <Input
                  id='second'
                  value={values.second}
                />
              )
            }
            <span data-testid='values'>{`${JSON.stringify(values)}`}</span>
            <span data-testid='errors'>{`${JSON.stringify(errors)}`}</span>
            <span data-testid='touches'>{`${JSON.stringify(touches)}`}</span>
          </form>
        );
      }}
    />
  );

  const { getByTestId } = render(formask);

  const values = JSON.parse((getByTestId('values').innerHTML))
  const errors = JSON.parse((getByTestId('errors').innerHTML))
  const touches = JSON.parse((getByTestId('touches').innerHTML))

  expect(values).toEqual(defaultValues);
  expect(errors).toEqual(defaultErrors);
  expect(touches).toEqual(defaultTouches);
});

test(`
  When the field is focused and blured, formask should run validation on it
`, async () => {
  const getSchema =  () => {
    return {
      validator: {
        first: {
          required: true,
          type: 'string'
        },
      },
      messages: {
        first: {
          required: 'first field is required',
        },
      }
    }
  }
  const formask = (
    <Formask
      schema={getSchema().validator}
      errorMessages={getSchema().messages}
      render={formaskProps => {
        const {
          submitHandler, values, errors,
          hook,
        } = formaskProps;
        return (
          <form onSubmit={submitHandler}>
            <h3>First</h3>
            {
              hook('first')(
                <Input
                  id='first'
                  value={values.first}
                />
              )
            }
            <small data-testid='first-error'>{JSON.stringify(errors.first)}</small>
          </form>
        );
      }}
    />
  );

  const { getByText, getByTestId } = render(formask);

  fireEvent.focus(document.getElementById('first'));
  fireEvent.blur(document.getElementById('first'));

  await wait();

  expect(getByTestId('first-error').innerHTML).toContain('first field is required');
});

test(`
  If schema is updated, formask will update schema accordingly and do fields validation
`, async () => {
  class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        validator: {
          first: {
            required: true,
            type: 'string'
          }
        },
        messages: {
          first: {
            required: 'first field is required',
          },
        }
      }
    }

    render() {
      const { validator, messages } = this.state;
      return (
        <Formask
          schema={validator}
          errorMessages={messages}
          render={formaskProps => {
            const {
              submitHandler, values, errors,
              hook,
            } = formaskProps;
            return (
              <form onSubmit={submitHandler}>
                <h3>First</h3>
                {
                  hook('first')(
                    <Input
                      id='first'
                      value={values.first}
                    />
                  )
                }
                <small data-testid='first-error'>{JSON.stringify(errors.first.message)}</small>
                <button type="button" onClick={() => this.setState({
                  validator: {}
                })}>
                  Change Validator
                </button>
              </form>
            );
          }}
        />
      );
    }

  }

  const {
    getByText, rerender, getByTestId,
    container
  } = render(<Form/>);

  fireEvent.focus(document.getElementById('first'));
  fireEvent.blur(document.getElementById('first'));

  await wait();

  expect(getByTestId('first-error').innerHTML).toContain('first field is required');  

  const leftClick = {button: 0};
  fireEvent.click(getByText('Change Validator'), leftClick);

  await wait();

  expect(getByTestId('first-error').innerHTML).toContain('');  

  // getByTestId('xxx')

  // console.log('container', container)
});
