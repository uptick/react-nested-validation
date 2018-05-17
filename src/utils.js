/**
 * Check for a "nil" value; undefined, null, or an empty string.
 */
export const isNil = value =>
  value === undefined || value === null || value === ''

export const isFunc = value =>
  typeof value === 'function'

export const capitalize = value =>
  `${value[0].toUpperCase()}${value.slice(1)}`
