import Form from './Form'

/**
 * Manages tracking of errors during validation.
 */
export default class ErrorSet {

  constructor() {
    this.errors = Form.normalizeErrors()
  }

  /**
   * Add an error to a form field.
   *
   * @param {string} field   The field to add an error to.
   * @param {string} message The error message.
   * @param {string} type    The type of error.
   */
  addFieldError(field, message, type = Form.ERROR) {
    const fieldErrors = this.errors.fields[field] || []
    fieldErrors.push({type, message})
    this.errors.fields[field] = fieldErrors
    this.updateCounts(type)
  }

  /**
   * Add a form level error.
   *
   * @param {string} message The error message.
   * @param {string} type    The type of error.
   */
  addFormError(message, type = Form.ERROR) {
    const formErrors = this.errors.form || []
    formErrors.push({type, message})
    this.errors.form = formErrors
    this.updateCounts(type)
  }

  updateCounts(type, count = 1) {
    this.errors.counts[type] = (this.errors.counts[type] || 0) + count
  }

}
