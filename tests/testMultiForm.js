import {expect} from 'code'

import Form from '../src/Form'

import {MultiForm} from './forms'

describe('Multi-forms', function() {

  describe('parsing', function() {

    describe('empty value', function() {
      let form = new MultiForm()
      let result = form.parse({})

      it('sets values for form A', function() {
        expect(form.state.values.a).to.not.be.undefined()
      })

      it('sets values for form B', function() {
        expect(form.state.values.b).to.not.be.undefined()
      })

    })

  })

  describe('updating', function() {
    let form = new MultiForm()

    it('merges values', function() {
      form.updateValue(Form.MULTI, {values: {a: ['v0']}})
      form.updateValue(Form.MULTI, {values: {b: ['v1']}})
      expect(form.state.values).to.equal({
        a: ['v0'],
        b: ['v1']
      })
    })

  })

})
