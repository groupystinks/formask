import * as React from 'react';
import Input from '../components/input/Input';
import i18n from '../i18n/i18n';
import Formask from 'formask';
import debounce from 'lodash/debounce'

async function fetchGithubUser(resolve, value) {
  const result = await fetch(`https://api.github.com/users/${value}`);
  resolve(result);
}
const debouncedFunc = debounce((resolve, value) => fetchGithubUser(resolve, value), 1000)

const promiseDebounce = (value) => {
  return new Promise(
    (resolve) => {
      debouncedFunc(resolve, value);
    },
    (reson) => {}
  )
}

const schema = {
  validator: {
    userasync: {
      required: true,
      type: 'string',
      async isUserAvailable(value) {
        const result = await promiseDebounce(value);
        if (result && result.ok) { return true }
        return false;
        // // Fake asynchronous
        // return new Promise((resolve) => {
        //   setTimeout(() => {
        //     if (value.length > 3) {
        //       resolve(true);
        //     } else {
        //       resolve(false);
        //     }
        //   }, 500)
        // })
      }
    },
  },
  messages: {
    userasync: {
      required: 'select field is required',
      isUserAvailable: i18n['user.not.avaialable'], 
    },
  }
}


// We gonna have input select that will search github user while user typing.
export default class Async extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Formask
          schema={schema.validator}
          defaultValues={{ userasync: 'sadsadxzczx' }}
          errorMessages={schema.messages}
          render={(formaskProps) => {
            const {
              hook, submitHandler, errors,
              values, touches
            } = formaskProps;
            return (
              <form onSubmit={submitHandler}>
                <div className='fields-area'>
                  <div className='field'>
                    {
                      hook('userasync')(
                        <Input
                          touch={touches.userasync}
                          error={errors.userasync}
                          value={values.userasync}
                          label={i18n['github.user']}
                        />
                      )
                    }
                  </div>
                </div>
              </form>
            );
          }}
        />
      </React.Fragment>
    )
  }
}
