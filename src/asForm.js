import React from 'react'
import Form from './Form'

import {isNil} from './utils'

/**
 * HOC to turn a React class into a form.
 */
export default (options = {}) => Inner =>
  class extends React.Component {
    static Form = options.form

    constructor(props) {
      super(props)
      if (!props.form) {
        const form = this.makeForm()
        if (props.onChange) {
          props.onChange({state: form.state})
        }
      }
    }

    getFormClass = () => {
      return this.props.Form || options.form
    }

    makeForm = forceValidation => {
      let Form = this.getFormClass()
      let form = new Form(this.getFormState())
      if (forceValidation) {
        form.validate(true)
      }
      return form
    }

    getFormState = () => {
      let {form = {}} = this.props
      if (!(form || {}).values) {
        let Form = this.getFormClass()
        form = new Form().parse(this.props.initial)
      }
      return Form.normalize({
        ...form
      })
    }

    // TODO: Deprecate.
    /* getFormValues = () => {
     *   const {form} = this.props
     *   let values = (form || {}).values
     *   if (!values) {
     *     let Form = options.form
     *     values = new Form().parse(this.props.initial).values
     *   }
     *   return values
     * } */

    handleChange2 = (payload, path) => {
      const {onChange, formPrefix} = this.props
      if (!isNil(formPrefix)) {
        console.debug('Deferring form update with prefix and path: ', formPrefix, path)
        if (!isNil(path)) {
          path = `${formPrefix}.${path}`
        }
        else {
          path = formPrefix
        }
        if (onChange) {
          onChange(payload, path)
        }
      }
      else {
        console.debug('Form changed with path and payload: ', path, payload)
        const form = this.makeForm()
        form.updateIn(payload, path)
        console.debug(' New state: ', form.state)
        if (onChange) {
          onChange({
            state: form.state,
            values: form.flat,
            payload,
            path
          })
        }
      }
    }

    handleChange = (name, value, options) => {
      const form = this.makeForm()
      form.updateValue(name, value, options)
      const {onChange, formPrefix} = this.props
      if (onChange) {
        if (formPrefix === Form.MULTI || !isNil(formPrefix)) {
          onChange(formPrefix, form.state)
        }
        else {
          onChange(form.state, name, value)
        }
      }
    }

    validate = force => {
      const errors = this.makeForm().validate()
      this.setState({errors})
    }

    shouldComponentUpdate(nextProps) {
      return (
        (nextProps.form || {}).values != (this.props.form || {}).values ||
        (nextProps.form || {}).errors != (this.props.form || {}).errors
      )
    }

    render() {

      // Need to be sure we have at least an object value
      // for form.
      let {form, Form, ...otherProps} = this.props
      if (isNil(form)) {
        form = this.makeForm(this.props.forceValidation).state
      }

      return (
        <Inner
          {...otherProps}
          form={form}
          onChange={this.handleChange2}
        />
      )
    }

  }
