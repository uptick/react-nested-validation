import React from 'react'
import Form from './Form'

import {isNil} from './utils'

/**
 * HOC to turn a React class into a form.
 */
export default options => Inner =>
  class extends React.Component {

    constructor(props) {
      super(props)
      if (!props.form) {
        const form = this.makeForm()
        if (props.onChange) {
          props.onChange(form.state)
        }
      }
    }

    makeForm = forceValidation => {
      let Form = options.form
      let form = new Form(this.getFormState())
      if (forceValidation) {
        form.validate(true)
      }
      return form
    }

    getFormState = () => {
      const {form = {}} = this.props
      return Form.normalize({
        ...form,
        values: this.getFormValues()
      })
    }

    getFormValues = () => {
      const {form} = this.props
      let values = (form || {}).values
      if (!values) {
        let Form = options.form
        values = new Form().parse(this.props.initial).values
      }
      return values
    }

    handleChange = (name, value) => {
      const form = this.makeForm()
      form.updateValue(name, value)
      const {onChange, formPrefix} = this.props
      if (onChange && !isNil(formPrefix)) {
        onChange(formPrefix, form.state)
      }
      else if (onChange) {
        onChange(form.state, name, value)
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
      let {form, ...otherProps} = this.props
      if (isNil(form)) {
        form = this.makeForm(this.props.forceValidation).state
      }

      return (
        <Inner
          {...otherProps}
          form={form}
          onChange={this.handleChange}
        />
      )
    }

  }
