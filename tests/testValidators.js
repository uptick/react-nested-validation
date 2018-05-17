import {expect} from 'code'

import Form from '../src/Form'
import ErrorSet from '../src/ErrorSet'
import {required, emptyWarning} from '../src/validators'

describe('required', function() {
  let form = new Form()

  it('passes when value present', function() {
    let form = new Form({values: {f0: 'v0'}})
    let errors = new ErrorSet()
    required('m0')(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.be.undefined()
  })

  it('uses provided message', function() {
    let errors = new ErrorSet()
    required('m0')(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.equal([{
      type: Form.ERROR,
      message: 'm0'
    }])
  })

  it('calls function for message', function() {
    let errors = new ErrorSet()
    required((fieldName, form) => 'm0')(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.equal([{
      type: Form.ERROR,
      message: 'm0'
    }])
  })

  it('uses default message', function() {
    let errors = new ErrorSet()
    required()(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.equal([{
      type: Form.ERROR,
      message: required.DEFAULT_MESSAGE
    }])
  })

})

describe('emptyWarning', function() {
  let form = new Form()

  it('passes when value present', function() {
    let form = new Form({values: {f0: 'v0'}})
    let errors = new ErrorSet()
    emptyWarning('m0')(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.be.undefined()
  })

  it('uses provided message', function() {
    let errors = new ErrorSet()
    emptyWarning('m0')(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.equal([{
      type: Form.WARNING,
      message: 'm0'
    }])
  })

  it('calls function for message', function() {
    let errors = new ErrorSet()
    emptyWarning((fieldName, form) => 'm0')(errors, 'f0', form)
    expect(errors.errors.fields.f0).to.equal([{
      type: Form.WARNING,
      message: 'm0'
    }])
  })

})
