import * as React from 'react';
import Button from '../components/common/Button';
import i18n from '../i18n/i18n';
import InputSelect from '../components/input/InputSelect';
import UncontrolledInput from '../components/input/UncontrolledInput';
import SubmitMessage from '../components/common/SubmitMessage';
import Formask from 'formask';

export default class HookComponents extends React.Component {
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
    const { msgType, submitMsg } = this.state;
    return (
      <React.Fragment>
        <Formask
          onSubmit={this.onSubmit}
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
                <div className="flex-hori-spaced">
                  <Button style={{ flex: 1, margin: '10px' }} disabled={isSubmitting} type="submit">{i18n['submit']}</Button>
                  <SubmitMessage message={submitMsg} type={msgType} />
                </div>
              </form>
            );
          }}
        />
      </React.Fragment>
    )
  }
}
