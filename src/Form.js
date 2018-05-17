import ErrorSet from './ErrorSet'

/**
 * Base class for creating new forms. A form is responsible for data
 * initialisation and validation. Forms may be used hierarchically, in both
 * objects and lists.
 */
export default class Form {

  static ERROR = 'error'

  static WARNING = 'warning'

  /**
   * Ensure an errors object has all standard fields.
   */
  static normalizeErrors = (errors = {}) => ({
    fields: {},
    form: [],
    counts: {},
    ...errors
  })

  /**
   * Ensure a form state object has all standard fields. Form state objects
   * need to have `touched`, `errors`, and `values` fields.
   */
  static normalize = value => {
    return {
      touched: {},
      errors: Form.normalizeErrors(),
      values: {},
      ...value
    }
  }

  /**
   * Construct a new form object.
   *
   * @param {object} state The form state.
   */
  constructor(state = {}) {
    this.state = Form.normalize(state)

    // Define any subforms. Fields can contain references to other forms for
    // directi subforms, but can also refer to an array with a single form type
    // element. This indicates an array of subforms.
    this.nested = {}

    // Define validators for each field of the form.
    this.fieldValidators = {}

    // The default values to be returned should no other values exist.
    this.defaultValues = {}
  }

  /**
   * Reconstruct incoming form values into a hierarchical representation. Forms
   * may have subforms as specified in the `fields` member. When initialising a
   * form it's convenient to specify just the values part of the initial data,
   * not with all the `touched` and `errors` fields. `parse` reorganises the
   * data into normal form.
   *
   * @param {(object|array)} values          Initial form data.
   * @param {bool}           forceValidation Force initial form validation.
   */
  parse(values, forceValidation) {
    if (Array.isArray(this.nested)) {
      const sub = new this.nested[0]()
      values = (values || []).map(x => sub.parse(x, forceValidation))
    }
    else if (this.nested) {
      values = values || {}
      let newValues = {
        ...values
      }
      for (const [fldName, Sub] of Object.entries(this.nested)) {
        const sub = new Sub()
        newValues[fldName] = sub.parse(values[fldName], forceValidation)
      }
      values = newValues
    }
    else {
      values = values || {}
    }
    this.state = {
      ...this.state,
      values,
      touched: {}
    }
    this.validate(forceValidation)
    return this.state
  }

  validate(force) {
    this.forceValidation = force // isTouched always returns true
    const errorSet = new ErrorSet()

    // If we're forcing validation we need to go over all sub-forms too.
    // Forced validation usually occurs from a parent form, and there's
    // no guarantee any of the subforms will have been validated.
    let values = this.getValues()
    if (force) {
      if (Array.isArray(values)) {
        const SubForm = this.nested[0]
        values = values.map(subValue => {
          const sub = new SubForm(subValue)
          sub.validate(force)
          return sub.state
        })
      }
      else {
        for (const [fieldName, SubForm] of Object.entries(this.nested)) {
          if (values[fieldName] !== undefined) {
            const sub = new SubForm(values[fieldName])
            sub.validate(force)
            values[fieldName] = sub.state
          }
        }
      }
      this.state = {
        ...this.state,
        values
      }
    }

    // Perform my local validation.
    this.validateFields(errorSet)
    this.validateForm(errorSet)

    // If the form value is an array add up counts from the sub-
    // forms in the array. Otherwise check if any sub-form fields
    // have counts to add.
    if (Array.isArray(values)) {
      for (const sub of values) {
        const {errors = {}} = sub
        for (const [type, count] of Object.entries(errors.counts || {})) {
          errorSet.updateCounts(type, count)
        }
      }
    }
    else {
      for (const fieldName of Object.keys(this.nested)) {
        const sub = values[fieldName]
        const {errors = {}} = sub || {}
        for (const [type, count] of Object.entries(errors.counts || {})) {
          errorSet.updateCounts(type, count)
        }
      }
    }

    this.state = {
      ...this.state,
      errors: errorSet.errors
    }
  }

  validateFields(errors) {
    for (const [fieldName, fieldValidator] of this.iterFieldValidators()) {
      if (!this.isTouched(fieldName)) {
        continue
      }
      fieldValidator(errors, fieldName, this)
    }
  }

  validateForm(errors) {
  }

  * iterFieldValidators() {
    for (const [fn, fvs] of Object.entries(this.fieldValidators)) {
      for (const fv of fvs) {
        yield [fn, fv]
      }
    }
  }

  updateValue(name, value) {
    let values = this.getValues()
    let touched
    if (Array.isArray(values)) {
      // TODO: Manage touched when removing an array item.
      if (name === null) {
        values = [
          ...values,
          Form.normalize(value)
        ]
      }
      else {
        name = parseInt(name)
        if (name >= 0 && name < values.length) {
          if (value === null) {
            values = [
              ...values.slice(0, name),
              ...values.slice(name + 1)
            ]
          }
          else {
            values = [
              ...values.slice(0, name),
              value,
              ...values.slice(name + 1)
            ]
          }
        }
      }
      touched = this.state.touched
    }
    else {
      values = {
        ...values,
        [name]: value
      }
      touched = this.updateTouched(name, value, this.state.touched)
    }
    this.state = {
      ...this.state,
      values,
      touched
    }
    this.state.errors = this.validate()
  }

  updateTouched(name, value, touched) {
    const initial = this.getInitial()
    touched = this.getTouched(touched)
    return {
      ...touched,
      [name]: !!((touched[name] || false) | (!!value || initial[name] != value))
    }
  }

  isTouched(name, touched) {
    const [state, last] = this.lookupForm(name)
    if (this.forceValidation) {
      // One is added to the touched value so that after a forced
      // validation the form doesn't forget about showing the error
      // after future changes.
      state.touched[last] = true
    }
    return (state.touched[last] || false)
  }

  getTouched(touched) {
    return this._getState(touched, 'touched', {})
  }

  getInitial(initial) {
    return this._getState(initial, 'initial', {})
  }

  getValues(values) {
    return this._getState(values, 'values', this.defaultValues)
  }

  getValue(name) {
    const [state, last] = this.lookupForm(name)
    return name ? state.values[last] : state.values
  }

  lookupForm(name) {
    let state = this.state
    if (name) {
      const parts = name.split('.')
      for (const part of parts.slice(0, parts.length - 1)) {
        state = state.values[part]
      }
      name = parts[parts.length - 1]
    }
    return [state, name]
  }

  _getState(value, name, fallback) {
    if (value === undefined) {
      value = this.state[name] || fallback
    }
    return value
  }

}
