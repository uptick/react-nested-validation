import {expect} from 'code'

import Form from '../src/Form'

import {ArrayForm, ParentForm, RequiredFieldForm} from './forms'

describe('Form', function() {

  describe('constructor', function() {

    describe('when empty', function() {
      let form = new Form()

      it('initialises touched to empty object', function() {
        expect(form.state.touched).to.equal({})
      })

    })

  })

  describe('parse', function() {

    describe('with basic values', function() {
      const values = {
        'f0': 'v0',
        'f1': 'v1'
      }
      let form = new Form()
      form.parse(values)

      it('sets values on form', function() {
        expect(form.state.values).to.equal(values)
      })

      it('does not set errors', function() {
        expect(form.state.errors).to.equal(Form.normalizeErrors())
      })

      it('does not set touched', function() {
        expect(form.state.touched).to.equal({})
      })

    })

    describe('with nested values', function() {
      const values = {
        'f0': 'v0',
        'f1': 'v1',
        'sub': {
          'f2': 'v2'
        }
      }
      let form = new ParentForm()
      form.parse(values)

      it('sets first level values on form', function() {
        expect(form.state.values.f0).to.equal(values.f0)
        expect(form.state.values.f1).to.equal(values.f1)
      })

      it('sets second level values on form', function() {
        expect(form.state.values.sub.values.f2).to.equal(values.sub.f2)
      })

      it('does not set first level errors', function() {
        expect(form.state.errors).to.equal(Form.normalizeErrors())
      })

      it('does not set second level errors', function() {
        expect(form.state.values.sub.errors).to.equal(Form.normalizeErrors())
      })

      it('does not set first level touched', function() {
        expect(form.state.touched).to.equal({})
      })

      it('does not set second level touched', function() {
        expect(form.state.values.sub.touched).to.equal({})
      })

    })

    describe('with array values', function() {
      const values = [
        {
          'f0': 'v1'
        },
        {
          'f1': 'v2'
        }
      ]
      let form = new ArrayForm()
      form.parse(values)

      it('sets array values on form', function() {
        expect(form.state.values[0].values).to.equal(values[0])
        expect(form.state.values[1].values).to.equal(values[1])
      })

      it('does not set array errors', function() {
        expect(form.state.values[0].errors).to.equal(Form.normalizeErrors())
        expect(form.state.values[1].errors).to.equal(Form.normalizeErrors())
      })

      it('does not set array touched', function() {
        expect(form.state.values[0].touched).to.equal({})
        expect(form.state.values[1].touched).to.equal({})
      })

    })

  })

  describe('updateValues', function() {

    describe('initialised', function() {
      let form = new RequiredFieldForm({
        values: {
          f0: 'v0'
        }
      })

      it('fails validation when cleared', function() {
        expect(form.state.values.f0).to.not.be.empty()
        form.updateValue('f0', '')
        expect(form.state.values.f0).to.be.empty()
        expect(form.state.errors.fields.f0).to.not.be.undefined()
      })

    })

  })

})
