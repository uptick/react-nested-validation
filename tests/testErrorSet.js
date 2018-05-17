import {expect} from 'code'

import ErrorSet from '../src/ErrorSet'
import Form from '../src/Form'

describe('ErrorSet', function() {

  describe('adding field errors', function() {

    it('consecutively adds them inline', function() {
      let errors = new ErrorSet()
      errors.addFieldError('f0', 'm0', Form.ERROR)
      errors.addFieldError('f0', 'm1', Form.WARNING)
      expect(errors.errors.fields.f0).to.equal([
        {
          type: Form.ERROR,
          message: 'm0'
        },
        {
          type: Form.WARNING,
          message: 'm1'
        }
      ])
    })

    it('separates by field name', function() {
      let errors = new ErrorSet()
      errors.addFieldError('f0', 'm0')
      errors.addFieldError('f1', 'm0')
      expect(errors.errors.fields.f0).to.equal([
        {
          type: Form.ERROR,
          message: 'm0'
        }
      ])
      expect(errors.errors.fields.f1).to.equal([
        {
          type: Form.ERROR,
          message: 'm0'
        }
      ])
    })

    it('uses default type of error', function() {
      let errors = new ErrorSet()
      errors.addFieldError('f0', 'm0')
      expect(errors.errors.fields.f0).to.equal([{
        type: Form.ERROR,
        message: 'm0'
      }])
    })

  })

  describe('adding form errors', function() {

    it('consecutively adds them inline', function() {
      let errors = new ErrorSet()
      errors.addFormError('m0', Form.ERROR)
      errors.addFormError('m1', Form.WARNING)
      expect(errors.errors.form).to.equal([
        {
          type: Form.ERROR,
          message: 'm0'
        },
        {
          type: Form.WARNING,
          message: 'm1'
        }
      ])
    })

    it('uses default type of error', function() {
      let errors = new ErrorSet()
      errors.addFormError('m0')
      expect(errors.errors.form).to.equal([{
        type: Form.ERROR,
        message: 'm0'
      }])
    })

  })

})
