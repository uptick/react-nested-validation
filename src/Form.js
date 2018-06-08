import ErrorSet from './ErrorSet'
import {capitalize} from './utils'

/**
 * Merge an object of values into a form.
 *
 * TODO: This should live elsewhere.
 */
function mergeValues(Form, state, values) {
  state = {
    ...state,
    values: {
      ...(state.values || {}),
      ...values
    }
  }
  const form = new Form(state)
  form.validate()
  return form.state
}

/**
 * Base class for creating new forms. A form is responsible for data
 * initialisation and validation. Forms may be used hierarchically, in both
 * objects and lists.
 */
export default class Form {

  static ERROR = 'error'

  static WARNING = 'warning'

  static MULTI = ''

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
    const initial = values
    if (Array.isArray(this.nested)) {
      values = (values || []).map(x => {
        const sub = new this.nested[0]()
        return sub.parse(x, forceValidation)
      })
      values = [
        ...(this.state.values || []),
        ...values
      ]
    }
    else {
      values = values || {}
      let newValues

      // If we've been given a set of fields to copy, use them.
      // Otherwise use all available fields.
      if (this.fields) {
        newValues = {}
        for (const fldName of this.fields) {
          newValues[fldName] = values[fldName]
        }
      }
      else {
        newValues = {
          ...values
        }
      }

      if (this.nested) {
        for (const [fldName, Sub] of Object.entries(this.nested)) {

          // Check for a nested parser and use that if it exists. If
          // not, use the same flat values.
          let subValues
          const func = this[`initial${capitalize(fldName)}`]
          if (func) {
            subValues = func(values, fldName)
          }
          else {
            subValues = values
          }

          const sub = new Sub()
          newValues[fldName] = sub.parse(subValues, forceValidation)
        }
      }
      values = {
        ...(this.state.values || {}),
        ...newValues
      }
    }

    // Call for any overloaded parsing. This is useful for things like
    // conversion to form select objects. This is preferable to
    // overlading `parse` as we want to do a single validation at the
    // end of value parsing.
    if (this.parseValues) {
      values = this.parseValues(values)
    }

    this.state = {
      ...this.state,
      values,
      touched: {},
      initial
    }

    // Handle multi-forms. Apply each multi-form to the same state we've
    // just calculated.
    for (const MultiForm of (this.multi || [])) {
      this.state = new MultiForm(this.state).parse(values, forceValidation)
    }

    // Render my flat version of values. Do this after we've recursed
    // so as to have all my values already rendered.
    this.render()

    this.validate(forceValidation)
    return this.state
  }

  render() {
    const {values} = this.state
    let flat
    if (Array.isArray(this.nested)) {
      flat = values.map(sub => sub.flat)
    }
    else {
      if (this.fields) {
        flat = {}
        for (const fldName of this.fields) {
          flat[fldName] = values[fldName]
        }
      }
      else {
        flat = {
          ...values
        }
      }
      for (const fldName of Object.keys(this.nested)) {
        const func = this[`render${capitalize(fldName)}`]
        const subFlat = this.state.values[fldName].flat
        if (func) {
          flat = func(flat, subFlat)
        }
        else {
          if (Array.isArray(subFlat)) {
            flat[fldName] = subFlat
          }
          else {
            flat = {
              ...flat,
              ...subFlat
            }
          }
        }
      }
    }
    this.state.flat = this.renderValues(flat)
    return flat
  }

  renderValues(values) {
    return values
    /* if (values === undefined) {
     *   values = this.state.values
     * }
     * if (Array.isArray(this.nested)) {
     *   const Sub = this.nested[0]
     *   values = (values || []).map(x => new Sub(x).renderValues())
     * }
     * else {
     *   values = values || {}
     *   if (this.nested) {
     *     let newValues = {
     *       ...values
     *     }
     *     for (const [fldName, Sub] of Object.entries(this.nested)) {
     *       const sub = new Sub(values[fldName])
     *       newValues[fldName] = sub.renderValues()
     *     }
     *     values = newValues
     *   }
     *   if(this.multi) {
     *     values = values || {}
     *     let newValues = {
     *       ...values
     *     }
     *     for (const Multi of this.multi) {
     *       newValues = {
     *         ...newValues,
     *         ...new Multi().renderValues(newValues)
     *       }
     *     }
     *     values = newValues
     *   }
     *   else {
     *     values = values || {}
     *   }
     * }
     * return values */
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

    // Perform any multi-form validation.
    for (const SubForm of this.multi || []) {
      const sub = new SubForm(values)
      sub.validate(force)
      errorSet.errors = ErrorSet.merge(errorSet.errors, sub.state.errors)
    }

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

    return this.state
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

  /**
   * TODO: This method has gotten a little crazy.
   */
  updateIn(payload, path) {
    if (path === undefined) {
      path = []
    } else if (!Array.isArray(path)) {
      path = path.split('.')
    }
    if (path.length > 0) {
      let subKey
      let subForm
      if (Array.isArray(this.nested)) {
        subKey = parseInt(path[0])
        const SubForm = this.nested[0]
        subForm = new SubForm(this.state.values[subKey])
      }
      else {
        subKey = path[0]
        const SubForm = this.nested[subKey]
        subForm = new SubForm(this.state.values[subKey])
      }
      subForm.updateIn(payload, path.slice(1))
      this.updateValue(subKey, subForm.state)
    }
    else {
      if (Array.isArray(this.nested) && Array.isArray(payload)) {
        for (const item of payload) {
          this.updateValue(null, item)
        }
      }
      else {
        for (const [key, value] of Object.entries(payload)) {
          if (key.includes('.')) {
            const splitKey = key.split('.')
            this.updateIn(
              {[splitKey[splitKey.length - 1]]: value},
              splitKey.slice(0, splitKey.length - 1)
            )
          }
          else {
            this.updateValue(key, value)
          }
        }
      }
    }
    this.render()
  }

  updateValue(name, value, options = {}) {
    let values = this.getValues()
    let touched = this.state.touched
    let errors
    if (Array.isArray(values)) {
      const SubForm = this.nested[0]

      // TODO: Manage touched when removing an array item.
      let names
      if (!Array.isArray(name)) {
        names = [name]
      }
      else {
        names = name
      }
      for (let name of names) {

        // Null name indicates appending an entry to the array.
        if (name === null) {
          const subForm = new SubForm()
          subForm.parse(value)
          values = [
            ...values,
            subForm.state
          ]
        }

        // A value for name indicates either deletion or bulk
        // update. Deletion is carried out when value is null.
        // Anything other than null is merged.
        else {
          name = parseInt(name)
          if (name >= 0 && name < values.length) {
            values = [
              ...values.slice(0, name),
              options.merge ? mergeValues(this.nested[0], values[name], value) : value,
              ...values.slice(name + 1)
            ]
          }
        }
      }
      values = values.filter(x => x !== null)
    }
    else {
      if (name === Form.MULTI) {
        values = {
          ...values,
          ...value.values
        }
        touched = {
          ...touched,
          ...(value.touched || {})
        }
        errors = value.errors
      }
      else {
        values = {
          ...values,
          [name]: value
        }
        touched = this.updateTouched(name, value, this.state.touched)
      }
    }
    this.state = {
      ...this.state,
      values,
      touched
    }
    this.state.errors = this.validate()
    if (errors) {
      this.state.errors = ErrorSet.merge(this.state.errors, errors)
    }
  }

  updateTouched(name, value, touched) {
    const initial = this.getInitial()
    touched = this.getTouched(touched)
    return {
      ...touched,
      [name]: !!((touched[name] || false) || (!!value || initial[name] != value))
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
