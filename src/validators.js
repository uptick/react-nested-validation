import Form from './Form'

import {isNil} from './utils'

/**
 * Helper to create a message for a validation error.
 *
 * @param {(string|function)} message        How to get the message.
 * @param {string}            fieldName      Field name generating the error.
 * @param {Form}              form           The form the error came from.
 * @param {string}            defaultMessage The default message to use.
 */
const makeMessage = (message, fieldName, form, defaultMessage) => {
  if (message instanceof Function) {
    return message(fieldName, form)
  }
  else {
    return message || defaultMessage
  }
}

const missing = (errors, fieldName, form, message, type, defaultMessage) => {
  const value = form.getValue(fieldName)
  if (isNil(value)) {
    errors.addFieldError(
      fieldName,
      makeMessage(message, fieldName, form, defaultMessage),
      type
    )
  }
}

/**
 * Validator creator for a required field. Returns a function that may
 * be called to validate a field has a non-nil value; should the check
 * fail an error will be assigned.
 *
 * The provided message may be a string, a function, or nil. A function
 * will be called with the field name and the form. A nil value for the
 * message will use the default message.
 *
 * @param {string} message The error message to display.
 * @returns {func}
 */
export const required = message =>
  (errors, fieldName, form) =>
    missing(errors, fieldName, form, message, Form.ERROR, required.DEFAULT_MESSAGE)

required.DEFAULT_MESSAGE = 'This field is required.'

/**
 * Validator creator for an empty field check. Returns a function that may
 * be called to validate a field has a non-nil value; should the check
 * fail a warning will be assigned.
 *
 * The provided message may be a string, or a function. A function
 * will be called with the field name and the form.
 *
 * @param {string} message The error message to display.
 * @returns {func}
 */
export const emptyWarning = message =>
  (errors, fieldName, form) =>
    missing(errors, fieldName, form, message, Form.WARNING)
