import * as React from 'react';
// import Button from '../components/common/Button';
import Input from '../components/custom/Input';
import i18n from '../i18n/i18n';
import Formask from 'formask';

const schema = {
  validator: {
    user: {
      required: true,
      type: 'string',
      isUserAvailable(value) {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (value.length > 3) {
              resolve(true);
            } else {
              resolve(false);
            }
          }, 500)
        })
      }
    },
  },
  messages: {
    user: {
      required: 'select field is required',
      isUserAvailable: i18n['user.not.avaialable'], 
    },
  }
}


// We gonna have input select that will search github user while user typing.
// 
export default class Async extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Formask
          schema={schema.validator}
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
                      hook('user')(
                        <Input
                          touch={touches.user}
                          error={errors.user}
                          value={values.user}
                          label={i18n['user']}
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
