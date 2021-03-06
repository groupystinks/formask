import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as warning from 'warning';
import { isArray, isString } from './utils';
import {
  getEmptyValueFromType, getCleanValueFromTypes, getType
} from './helpers/types';
import { getErrorProxy } from './helpers/proxy';
import { objectDeepEqual } from './helpers/equal';
import { resetTypeEnum, ResetType } from './helpers/enum';
import kya from 'kya';

function noop () { return; }

export interface FormaskAPI {
  defaultValues: FormValues | {};
  defaultErrors?: ErrorMessages;
  defaultTouches?: FormTouches;
  render?: (props: FormaskProps) => React.ReactElement<{}>;
  onSubmit?: (values: FormValues, formaskProps: FormaskProps ) => void;
  schema: KyaSchema;
  errorMessages?: ErrorMessages;
  options: FormaskOptions;
}

export interface KyaSchema {
  [field: string]: KyaFieldSchema;
}
export type KyaFieldSchema = 
  { type: string; } &
  {required?: boolean; } &
  {
    [customrule: string]: (value: {}) => Promise<boolean> | boolean
  };

export interface FormaskOptions {
  validateOnBlur: Boolean;
  validateOnChange: Boolean;
}

export type ErrorMessages = {
  [field: string]: {};
};

export type FormValues = {
  // User passed in value could be any
  // tslint:disable-next-line:no-any
  [field: string]: any;
};

export interface FormErrors {
  [field: string]: { error?: {}, valid: boolean};
}

export interface FormTouches {
  [field: string]: boolean;
}

export interface FieldTypes {
  [field: string]: string;
}

export interface HookProps {
  // User passed in props could be any
  // tslint:disable-next-line:no-any
  [x: string]: any;
  key: string;
  // tslint:disable-next-line:no-any
  defaultValue: any;
  formaskfield: string;
  // Value could be any
  // tslint:disable-next-line:no-any
  value: any;
  onChange: Function;
  onBlur: Function;
}

export interface ValidateOptions {
  afterValidation?: (result: Object, isValid: boolean) => void;
  onlyTouched?: Boolean;
}

export interface FormaskMethods {
  getFieldsValue: () => FormValues;
  hook: (id: string, options: { changeHandlerName?: string, blurHandlerName?: string, controlled?: boolean }) =>
    (ele: React.ReactElement<{}>) => React.ReactElement<HookProps>;
  reset: (options?: { type?: 'initial' | 'clean', fields?: Array<string> }) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setErrors: (touches: FormTouches) => void;
  setTouches: (touches: FormTouches) => void;
  setValues: (values: FormValues) => void;
  validate: (fields?: Array<string>, options?: ValidateOptions) => void;
}

export interface InternalState {
  errors: FormErrors | {};
  values: FormValues;
  touches: FormTouches;
  types: FieldTypes;
  isValid: boolean;
  isSubmitting: boolean;
}

export interface FormaskHandlers {
  submitHandler: (e: React.FormEvent<{}>) => void;
  changeHandler: (e: React.ChangeEvent<{}>) => void;
  blurHandler: (e: React.FocusEvent<{}>) => void;
}

export type FormaskProps = InternalState & FormaskHandlers & FormaskMethods;
type UncontrolledIndex = number;

export default class Formask extends React.Component<FormaskAPI, InternalState> {
  static propTypes = {
    defaultValues: PropTypes.object,
    defaultErrors: PropTypes.object,
    defaultTouches: PropTypes.object,
    validator: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.any,
    options: PropTypes.object,
  };

  static defaultProps = {
    schema: {},
    defaultErrors: {},
    defaultValues: {},
    options: {
      validateOnBlur: true,
      validateOnChange: true
    },
  };

  uncontrolledIndex !: UncontrolledIndex;
  resetType !: ResetType;

  constructor(props: FormaskAPI) {
    super(props);

    const values = props.defaultValues || {};

    const defaultTypes = Object.keys(values).reduce(
      (accu, fieldkey) => {
        if (values.hasOwnProperty(fieldkey)) {
          accu[fieldkey] = getType(values[fieldkey]);
        }
        return accu;
      },
      {}
    );

    const errorsObj = {
      ...props.defaultErrors,
    };

    const errors = getErrorProxy(errorsObj);

    this.uncontrolledIndex = 0;
    this.resetType = resetTypeEnum.noreset;

    this.state = {
      values,
      errors,
      touches: props.defaultTouches || {},
      types: defaultTypes,
      isValid: true,
      isSubmitting: false,
    };
  }

  componentDidMount() {
    // If defaultValues is specified, validator will do the first round check
    // on default values.
    const { defaultValues } = this.props;
    const fields = Object.keys(defaultValues);
    this.validate(fields);
  }

  componentDidUpdate(prevProps: FormaskAPI) {
    if (!objectDeepEqual(prevProps.schema, this.props.schema)) {
      this.validate(undefined, { onlyTouched: true });
      return;
    }
  }

  getFormaskProps = () => {
    const {
      values, isSubmitting, touches,
      errors, isValid, types,
    } = this.state;
    const formaskProps: FormaskProps = {
      errors,
      values,
      touches,
      types,
      isValid,
      isSubmitting,
      setIsSubmitting: this.setIsSubmitting,
      submitHandler: this.submitHandler,
      changeHandler: this.changeHandler,
      blurHandler: this.blurHandler,
      reset: this.reset,
      getFieldsValue: this.getFieldsValue,
      hook: this.hook,
      setErrors: this.setErrors,
      setTouches: this.setTouches,
      setValues: this.setValues,
      validate: this.validate,
    };
    return formaskProps;
  }

  getFieldsValue = () => {
    return this.state.values; 
  }

  hook = (
    id: string,
    options: { changeHandlerName?: string, blurHandlerName?: string, controlled?: boolean } = {},
  ) => (Widget: React.ReactElement<HookProps>) => {
    const {
      changeHandlerName = 'onChange',
      blurHandlerName = 'onBlur',
      controlled = true,
    } = options;
    // we don't know what unknown is.
    // tslint:disable-next-line:no-any
    const hookChangeHandler = (unknown: any) => {
      // calling props.onChange.
      if (
        Widget.props[changeHandlerName] &&
        typeof Widget.props[changeHandlerName] === 'function'
      ) {
        if (typeof Widget.props[changeHandlerName] === 'function') {
          Widget.props[changeHandlerName](unknown);
        }
      }

      let value = unknown;
 
      // handle Web Browser's change event
      if (unknown.target && unknown.type === 'change') {
        value = unknown.target.value;
      }

      // calling formask's change handler
      this.customChangeHandler({ id, value });
    };

    const hookBlurHandler = (unknown: {}) => {
      // calling props.onBlur directly
      if (
        Widget.props[blurHandlerName] &&
        typeof Widget.props[blurHandlerName] === 'function'
      ) {
        Widget.props[blurHandlerName](unknown);
      }

      this.blurHandler(id);
    };

    // If form is reseting and component is uncontrolled,
    // RESET KEY
    if (!controlled) {
      let HookWidget = React.cloneElement(
        Widget,
        {
          ...Widget.props,
          key: `${id}-${this.uncontrolledIndex}`,
          formaskfield: id,
          defaultValue: this.props.defaultValues[id] || '',
          [changeHandlerName]: hookChangeHandler,
          [blurHandlerName]: hookBlurHandler,
        }
      );

      switch (this.resetType) {
        case resetTypeEnum.initial: {
          HookWidget = React.cloneElement(
            Widget,
            {
              ...Widget.props,
              key: `${id}-${this.uncontrolledIndex}`,
              formaskfield: id,
              defaultValue: this.props.defaultValues[id] || '',
              [changeHandlerName]: hookChangeHandler,
              [blurHandlerName]: hookBlurHandler,
            }
          );
          break;
        }
        case resetTypeEnum.clean: {
          HookWidget = React.cloneElement(
            Widget,
            {
              ...Widget.props,
              key: `${id}-${this.uncontrolledIndex}`,
              formaskfield: id,
              defaultValue: getEmptyValueFromType(this.state.types[id]) || '',
              [changeHandlerName]: hookChangeHandler,
              [blurHandlerName]: hookBlurHandler,
            }
          );
          break;
        }

        default:
          break;
      }

      return HookWidget;
    }

    return React.cloneElement(
      Widget,
      {
        ...Widget.props,
        formaskfield: id,
        value: Widget.props.value,
        [changeHandlerName]: hookChangeHandler,
        [blurHandlerName]: hookBlurHandler,
      }
    );
  }

  customChangeHandler = (option: { id: string, value: {} }) => {
    const field = option.id;
    const { options: { validateOnChange } } = this.props;
    const { touches } = this.state;
    const type = getType(option.value);

    warning(
      !!field,
      'Field name is missing, giving as least name or id attributes to input'
    );

    const touched = touches[field];

    this.setState((prevState) => {
      return {
        types: {
          ...prevState.types,
          [field]: type,
        },
        values: {
          ...prevState.values,
          [field]: option.value
        }
      };
    },
                  (validateOnChange && touched) ?
        this.validate.bind(this, undefined, { onlyTouched: true }) :
        noop
    );
  }

  changeHandler = (e: React.ChangeEvent<{id: string, name?: string, value: string}>) => {
    e.persist();

    const { id, name, value } = e.target;
    const { options: { validateOnChange } } = this.props;
    const { touches } = this.state;
    const field = name || id;
    const type = getType(value);

    warning(
      !!field,
      'Field name is missing, giving as least name or id attributes to input'
    );

    const touched = touches[field];

    this.setState((prevState) => {
      return {
        types: {
          ...prevState.types,
          [field]: type,
        },
        values: {
          ...prevState.values,
          [field]: value
        }
      };
    },
                  (validateOnChange && touched) ? this.validate.bind(this, [field]) : noop
    );
  }

  // tslint:disable-next-line:no-any
  blurHandler = (unknown: any): void | ((e: {}) => void) => {

    const { schema = {}, options: { validateOnBlur } } = this.props;
    // if unknown is an event
    if (unknown.target && unknown.type === 'blur') {
      unknown.persist();
      const { id, name } = unknown.target;

      return this.setState((prevState) => {
        return {
          touches: {
            ...prevState.touches,
            [name || id]: true,
          }
        };
      });
    }

    const field = isString(unknown) && unknown;

    warning(
      !!field,
      'Field name is missing, giving as least name or id attributes to input'
    );

    this.setState((prevState) => {
      return {
        touches: {
          ...prevState.touches,
          [field]: true
        }
      };
    },
                  (validateOnBlur && schema[field]) ?
        this.validate.bind(this, undefined, { onlyTouched: true }) :
        noop
    );
  }
  
  setErrors = (newErrors = {}) => {
    this.setState((prevState) => {
      return {
        errors: getErrorProxy({
          ...prevState.errors,
          ...newErrors
        })
      };
    });
  }

  setTouches = (newTouches = {}) => {
    this.setState((prevState) => {
      return {
        touches: {
          ...prevState.touches,
          ...newTouches
        }
      };
    });
  }

  setValues = (newValues = {}) => {
    this.setState((prevState) => {
      return {
        values: {
          ...prevState.values,
          ...newValues
        }
      };
    });
  }

  reset = (
    options: { type?: string, fields?: Array<string> } = {}
  ) => {
    const { type = 'clean', fields } = options;

    this.uncontrolledIndex++;
    
    switch (type) {
      case 'clean': {
        this.resetType = resetTypeEnum.clean;

        if (fields) {
          this.setState((prevState) => {
            const { 
              types, values: newValues, touches: newTouches, errors: newErrors,
            } = prevState;
            fields.forEach(field => {
              const filedtype = types[field];
              newValues[field] = getEmptyValueFromType(filedtype) || undefined;
              newTouches[field] = false;
              newErrors[field] = { valid: true };
            });
            return {
              values: newValues,
              touches: newTouches,
              errors: getErrorProxy(newErrors),
            };
          });
          break;
        }
        this.setState((prevState) => {
          const { types } = prevState;
          return {
            isValid: true,
            values: getCleanValueFromTypes(types),
            touches: {},
            errors: getErrorProxy({}),
          };
        });
        break;
      }
      case 'initial': {
        const { defaultValues = {}, defaultErrors = {}, defaultTouches = {} } = this.props;
        this.resetType = resetTypeEnum.initial;
        if (fields) {
          this.setState((prevState) => {
            const {
              values: newValues, touches: newTouches, errors: newErrors,
              types
            } = prevState;
            fields.forEach(field => {
              const filedtype = types[field];
              newValues[field] = defaultValues[field] || getEmptyValueFromType(filedtype);
              newTouches[field] = defaultTouches[field];
              newErrors[field] = defaultErrors[field];
            });
            return {
              values: newValues,
              touches: newTouches,
              errors: getErrorProxy(newErrors),
            };
          });
          break;
        }
        this.setState((prevState) => {
          const { types } = prevState;
          return {
            isValid: true,
            values: {
              ...getCleanValueFromTypes(types),
              ...defaultValues
            },
            touches: defaultTouches,
            errors: getErrorProxy(defaultErrors),
          };
        });
        break;
      }
      default:
        break;
    }
  }

  setIsSubmitting = (isSubmitting = false) => {
    this.setState({
      isSubmitting
    });
  }

  submitHandler = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const { onSubmit = noop } = this.props;
    const { values } = this.state;

    // internal form handler, validation etc..
    this.setState(
      () => ({ isSubmitting: true })
    );

    this.validate(undefined, {
      afterValidation: (result, isValid) => {
        onSubmit(
          values,
          Object.assign(
            this.getFormaskProps(),
            {
              errors: result,
              isValid
            }
          )
        );
      }}
    );
  }

  validate = (
    fields?: Array<string>,
    options: ValidateOptions = {}
  ) => {
    const { values, touches } = this.state;
    const { schema = {}, errorMessages } = this.props;
    const { afterValidation, onlyTouched } = options;
    let result;

    if (fields && isArray(fields)) {
      const valFields = onlyTouched ? fields.filter(field => touches[field]) : fields;
      result = kya(schema, errorMessages).validateOn(values, ...valFields);
    } else {
      const valScehma = Object.assign({}, schema);

      if (onlyTouched) {
        for ( let field in valScehma ) {
          if (!touches[field]) {
            delete valScehma[field];
          }
        }
      }
      
      result = kya(valScehma, errorMessages).validate(values);
    }

    result.then((re: FormErrors) => {
      const isValid = Object.keys(re).every(key => {
        return re[key].valid;
      });
      const newErrors = Object.assign({}, re);

      this.setState({
        errors: getErrorProxy(newErrors),
        isValid
      },            () => afterValidation && afterValidation(newErrors, isValid));
    });
  }

  render() {
    const { render, children } = this.props;
    const injectedProps: FormaskProps = this.getFormaskProps();
    return render ?
      (render as Function)(injectedProps) :
      children ?
        typeof children === 'function' ?
        (children as Function)(injectedProps) :
        React.Children.count(children) !== 0 ?
          React.Children.only(children) :
          null
      : null;
  }
}
