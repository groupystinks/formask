# Formask
Formask is minimal form management abstract implemented by React. Provided with asynchronous validation, dynamic validation schema and work with native and third-party input field.

## Install

```bash
npm i formask --save
```

## API

### Props

#### defaultValues?: {[field: string]: any}
`defaultValues` defines initial value of each field.
These initial values are stored in formask internal state and could be accessed through `props.values` either in render props (`render: (props: FormaskProps) => ReactElement`) or children if it's function (`children: (props: FormaskProps) => ReactElement`).

#### defaultErrors?: {[field: string]: { error?: any, valid: boolean}}
`defaultErrors` defines initial error of each field.
Initial errors are stored in formask internal state and can be accessed through
`props.errors` like defaultValue does.

#### defaultTouches?: {[field: string]: boolean}
`defaultTouches` defines initial touch of each field. Touch is stored in internal
state to track each field's user interaction status, where `true` means already interacted. It can be accessed through `props.touches` like defaultValue does.

#### render?: (props: FormaskProps) => React.ReactElement<any>
`redner` is a function to define Component will be rendered.
`render`'s first parameter is [FormaskProps](#Formaskprops) where all utility functions
and internal state are passed in.

#### onSubmit?: (values: FormValues, formaskProps: FormaskProps ) => void
`onSubmit` is a function to be called while 'onsubmit' event is triggered. It will be passed in
form [FormValues](#values:%20{%20[field:%20string]:%20any%20}) and [FormaskProps](#Formaskprops).

#### schema?: { [field: string]: { type: string; required?: boolean; [customrule: string]: (value) => Promise<boolean> | boolean } }
`schema` defines validation rule of each form field. it should manifest itself in [Example](#Example) section.
`type` should be either 'array', 'boolean', 'number', 'object' or 'string'.
`required` specify neccassary field. Formask will bypass field from validation if required is false.
`customrule` is used as customized validation function. return `true` means check pass, return `false`
means check failed.

#### errorMessages?: { [field: string]: any }
`errorMessages` defines corresponding error message to schema. If error occur, message will be exposed in `props.errors` (see [FormaskProps](#Formaskprops)). It could be string, react element and whatever you may want when error occurs.

### FormaskProps
`FormaskProps` is composed of internal state, methods and event handlers of Formask. It will be exposed in API like `render`, `onSubmit` and etc..

#### errors: { [field: string]: { error?: any, valid: boolean} }
`errors` specifies error message and valid status in each field.

#### values: { [field: string]: any }
`values` specifies value in each field.

#### touches: { [field: string]: boolean }
`touches` specifies touch status in each field. Normally, touch is set to `true` while user blur on input field.
For those fields have no input, please see [Custom Touch Field](#Custom%20Touch%20Field).

#### types: { [field: string]: string }
`types` specifies data type for each field if available. Formask will detect field data type from defaultValues, onChange event and etc..

#### isValid: boolean
`isValid` specifies validation status on form.

#### isSubmitting: boolean
`isSubmitting` turn `true` if form submit handler is triggered. Afterwards, [setIsSubmitting](#setIsSubmitting:%20(isSubmitting:%20boolean)%20=>%20void) is exposed to manipulate its status.

#### submitHandler: (e: React.FormEvent<any>) => void
Event handlers of _onsubmit_ event. Normally you would want to put it in form onsubmit attribute like:
```jsx
  <form onSubmit={submitHandler}>
  ...
```

#### changeHandler: (e: React.ChangeEvent<any>) => void
Event handlers of _onchange_ event. It will hook input value into Formask's `values`.
Normally you would wnat to use it while your field component is native input like:
```jsx
  <input
    id="first"
    value={values.first}
    onChange={changeHandler}
    onBlur={blurHandler}
  />
```

#### blurHandler: (e: any) => void | ((e: any) => void)
Event handlers of _onblur_ event. It will set Formask's `touches` once user on blur input.
Like onChangeHanlder, we would like to use it in native input.

#### getFieldsValue: () => FormValues
Get [FormValues](#values:%20{%20[field:%20string]:%20any%20}).

#### hook: (id: string, options: { changeHandlerName: string, blurHandlerName: string }) => (ele: React.ReactElement<{}>) => React.ReactElement<HookProps>;
`hook` serve as a bridge to connect Formask and Widget. Widget is any React element you want to record its
value into Formask's field. Under the hood, hook does few things you need to know:
- Set id
- Clone original Widget, add few props and pass on.
- Pass Formask's onChange/onBlur to Widget, by which user can "hook" their Widget into Formask.
For more real use cases, you probably want to see [Example](#Example).

#### setIsSubmitting: (isSubmitting: boolean) => void
Modify isSubmitting status.

#### reset: (options?: { type?: string, fields?: Array<string> }) => void
**passing nothing**
If no parameters is passed in, Formask reset all fields to clean state.

**options.type**:
`reset` literally means to clear all changes. By definition, there's two types of reset you can set in options.type:
1. clean(default)
  By passing `'clean'` to type, Formask will clean all internal state into empty, including values, errors and etc..
2. initial
  By passing `'initial'` to type, Formask will reset to default values previously set by [defaultValues](#defaultValues?:%20{[field:%20string]:%20any}), [defaultErrors](#defaultErrors?:%20{[field:%20string]:%20{%20error?:%20any,%20valid:%20boolean}}) and etc..

**options.fields**
If `options.fields` is passed in, Formask will only reset specified fields according to what reset type is.

#### setTouches: (touches: FormTouches) => void
`setTouches` manipulate Formask [touches](#touches:%20{%20[field:%20string]:%20boolean%20}).
It let you can change touches on those non-input fields.

#### validate: (fields?: Array<string>) => Promise<Object>
`validate` will check fields value against schema and return result in promise. It support asynchronous validation. By default, if no parameters is passed, it will go through all fields. Optionally, you can pass in `fields` to specify which to validate.

While [submitHandler](#submitHandler:%20(e:%20React.FormEvent<any>)%20=>%20void) is triggered, `validate` will be executed.
