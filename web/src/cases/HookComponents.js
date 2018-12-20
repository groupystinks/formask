import * as React from 'react';
import Button from '../components/common/Button';
import i18n from '../i18n/i18n';
import InputSelect from '../components/custom/InputSelect';
import UncontrolledInput from '../components/custom/UncontrolledInput';
import Formask from 'formask';

export default class DynamicSchema extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Formask
          render={(formaskProps) => {
            const {
              values, isSubmitting, hook,
              reset, touches,
              submitHandler,
              errors,
            } = formaskProps;
            return (
              <form onSubmit={submitHandler}>
                <div className='fields-area'>
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
                  <div className='field'>
                  {
                    hook('uncontrolled', { controlled: false })(
                      <UncontrolledInput
                        touch={touches.uncontrolled}
                        error={errors.uncontrolled}
                        defaultValue={values.uncontrolled}
                        label={i18n['nickname']}
                      />
                    )
                  }
                  </div>
                </div>
                <Button disabled={isSubmitting} type="submit">Submit</Button>
              </form>
            );
          }}
        />
      </React.Fragment>
    )
  }
}
